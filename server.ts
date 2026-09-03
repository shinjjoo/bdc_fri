import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import {
  RoomState,
  Member,
  CueSignal,
  ClientToServerEvent,
  ServerToClientEvent,
  SongItem,
  PrayerTopic,
  QuickPreset,
  QuickReply,
  ChatMessage,
} from './src/types.js';
import { DEFAULT_PRESETS, SAMPLE_SONGS, SAMPLE_PRAYER_TOPICS } from './src/data/presets.js';

const app = express();
const PORT = 3000;
const server = http.createServer(app);

app.use(express.json());

// Google Drive Friday PDF Integration
const GOOGLE_DRIVE_FILE_ID = '1KIKvQ4376e3vsS0DMj2T7JTpOar4He1g';
const GOOGLE_DRIVE_DOWNLOAD_URL = `https://drive.usercontent.google.com/download?id=${GOOGLE_DRIVE_FILE_ID}&export=download`;
const LOCAL_PUBLIC_PDF = path.join(process.cwd(), 'public', 'friday.pdf');
const LOCAL_DIST_PDF = path.join(process.cwd(), 'dist', 'friday.pdf');

function getValidLocalPdfPath(): string | null {
  if (fs.existsSync(LOCAL_PUBLIC_PDF) && fs.statSync(LOCAL_PUBLIC_PDF).size > 1000000) {
    return LOCAL_PUBLIC_PDF;
  }
  if (fs.existsSync(LOCAL_DIST_PDF) && fs.statSync(LOCAL_DIST_PDF).size > 1000000) {
    return LOCAL_DIST_PDF;
  }
  return null;
}

let isDownloadingPdf = false;
async function ensureFridayPdf(): Promise<string | null> {
  const existing = getValidLocalPdfPath();
  if (existing) return existing;
  if (isDownloadingPdf) return null;

  isDownloadingPdf = true;
  console.log('[ScorePDF] Downloading friday.pdf from Google Drive ID:', GOOGLE_DRIVE_FILE_ID);
  try {
    const res = await fetch(GOOGLE_DRIVE_DOWNLOAD_URL);
    if (!res.ok) throw new Error(`Google Drive download failed with status ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_PUBLIC_PDF, buffer);
    console.log('[ScorePDF] Successfully saved friday.pdf, size:', buffer.length);
    isDownloadingPdf = false;
    return LOCAL_PUBLIC_PDF;
  } catch (err) {
    console.error('[ScorePDF] Failed to download from Google Drive:', err);
    isDownloadingPdf = false;
    return null;
  }
}

// Serve public static assets
app.use(express.static(path.join(process.cwd(), 'public')));

// Score PDF endpoint supporting byte range requests
app.get('/api/score-pdf', async (req, res) => {
  let pdfPath = getValidLocalPdfPath();
  if (!pdfPath) {
    pdfPath = await ensureFridayPdf();
  }

  if (pdfPath) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="friday.pdf"');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.sendFile(pdfPath);
  }

  // Fallback if local file couldn't be prepared yet
  res.redirect(GOOGLE_DRIVE_DOWNLOAD_URL);
});

// Score Page Image Endpoint (Ultra-fast 150 DPI scanned sheets from friday.pdf)
app.get('/api/score-page/:pageNum', async (req, res) => {
  const pageNum = parseInt(req.params.pageNum, 10);
  if (isNaN(pageNum) || pageNum < 1 || pageNum > 101) {
    return res.status(400).send('Invalid page number');
  }

  const pagePath = path.join(process.cwd(), 'public', 'score_pages', `page_${pageNum}.png`);
  if (fs.existsSync(pagePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.sendFile(pagePath);
  }

  // If page doesn't exist yet, render it on the fly with Ghostscript
  const pdfPath = await ensureFridayPdf();
  if (pdfPath) {
    try {
      const { execSync } = await import('child_process');
      const outDir = path.join(process.cwd(), 'public', 'score_pages');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150 -dFirstPage=${pageNum} -dLastPage=${pageNum} -sOutputFile="${pagePath}" "${pdfPath}"`);
      if (fs.existsSync(pagePath)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.sendFile(pagePath);
      }
    } catch (e) {
      console.error('On-demand render error:', e);
    }
  }

  res.status(404).send('Page not found');
});

// Kick off initial PDF verification on boot
ensureFridayPdf();

// In-memory room store
const rooms = new Map<string, RoomState>();
const socketMeta = new Map<WebSocket, { roomId: string; memberId: string }>();

// Helper to get or initialize a room
function getOrCreateRoom(roomId: string, roomName?: string): RoomState {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      roomId,
      roomName: roomName || roomId,
      createdAt: Date.now(),
      activeCue: null,
      cueHistory: [],
      currentSongIndex: 0,
      songs: [...SAMPLE_SONGS],
      prayerTopics: [...SAMPLE_PRAYER_TOPICS],
      currentPrayerTopicIndex: 0,
      prayerTimer: null,
      members: [],
      customPresets: [...DEFAULT_PRESETS],
      recentReplies: [],
      messages: [],
    };
    rooms.set(roomId, room);
  }
  return room;
}

// Broadcast helper for WebSocket
function broadcastToRoom(roomId: string, message: ServerToClientEvent, excludeSocket?: WebSocket) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeSocket) {
      const meta = socketMeta.get(client);
      if (meta && meta.roomId === roomId) {
        client.send(json);
      }
    }
  });
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    roomsCount: rooms.size,
    totalConnections: wss.clients.size,
    timestamp: Date.now(),
  });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Setup WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (rawData: string) => {
    try {
      const event = JSON.parse(rawData.toString()) as ClientToServerEvent;
      handleSocketEvent(ws, event);
    } catch (err) {
      console.error('Error handling websocket message:', err);
    }
  });

  ws.on('close', () => {
    const meta = socketMeta.get(ws);
    if (meta) {
      const { roomId, memberId } = meta;
      const room = rooms.get(roomId);
      if (room) {
        room.members = room.members.filter((m) => m.id !== memberId);
        broadcastToRoom(roomId, {
          type: 'MEMBER_LEFT',
          payload: { memberId },
        });
        broadcastToRoom(roomId, {
          type: 'ROOM_STATE',
          payload: room,
        });
      }
      socketMeta.delete(ws);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket client error:', err);
  });
});

function handleSocketEvent(ws: WebSocket, event: ClientToServerEvent) {
  switch (event.type) {
    case 'JOIN_ROOM': {
      const { roomId, roomName, name, role, isLeader } = event.payload;
      const room = getOrCreateRoom(roomId, roomName);

      const memberId = `${role.toLowerCase()}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const member: Member = {
        id: memberId,
        name: name.trim() || role,
        role,
        isLeader,
        connectedAt: Date.now(),
        lastSeen: Date.now(),
        color: role === 'LEADER' ? 'amber' : 'emerald',
      };

      // Remove any duplicate previous session from same name/role if any
      room.members = room.members.filter((m) => !(m.name === member.name && m.role === member.role));
      room.members.push(member);

      socketMeta.set(ws, { roomId, memberId });

      // Send initial full room state to the newly joined client with their memberId
      ws.send(JSON.stringify({
        type: 'ROOM_STATE',
        payload: {
          ...room,
          myMemberId: member.id,
        },
      } as ServerToClientEvent));

      // Broadcast to other members that someone joined
      broadcastToRoom(roomId, {
        type: 'MEMBER_JOINED',
        payload: member,
      }, ws);
      break;
    }

    case 'SEND_CUE': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      const cue: CueSignal = {
        ...event.payload.cue,
        id: `cue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        acknowledgedBy: [],
      };

      room.activeCue = cue;
      room.cueHistory.unshift(cue);
      if (room.cueHistory.length > 60) {
        room.cueHistory = room.cueHistory.slice(0, 60);
      }

      broadcastToRoom(meta.roomId, {
        type: 'CUE_RECEIVED',
        payload: cue,
      });
      break;
    }

    case 'ACK_CUE': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room || !room.activeCue) return;

      const { cueId } = event.payload;
      const targetCueId = cueId || room.activeCue.id;
      if (room.activeCue.id === targetCueId) {
        let member = room.members.find((m) => m.id === meta.memberId);
        if (!member && room.members.length > 0) {
          member = room.members[0];
        }
        if (member) {
          const alreadyAcked = room.activeCue.acknowledgedBy.some(
            (a) => a.memberId === member!.id || a.memberName === member!.name
          );
          if (!alreadyAcked) {
            const acknowledgment = {
              memberId: member.id,
              memberName: member.name,
              memberRole: member.role,
              timestamp: Date.now(),
            };
            room.activeCue.acknowledgedBy.push(acknowledgment);

            broadcastToRoom(meta.roomId, {
              type: 'CUE_ACKED',
              payload: { cueId: room.activeCue.id, acknowledgment },
            });
          }
        }
      }
      break;
    }

    case 'SEND_QUICK_REPLY': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      const member = room.members.find((m) => m.id === meta.memberId);
      if (!member) return;

      const { cueId, type, message } = event.payload;
      const quickReply: QuickReply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        cueId,
        senderId: member.id,
        senderName: member.name,
        senderRole: member.role,
        message: message || (type === 'OK' ? '확인했습니다' : type === 'READY' ? '준비 완료' : type === 'REPEAT' ? '한 번 더 요청' : '코드 확인'),
        timestamp: Date.now(),
        type,
      };

      room.recentReplies.unshift(quickReply);
      if (room.recentReplies.length > 20) {
        room.recentReplies = room.recentReplies.slice(0, 20);
      }

      broadcastToRoom(meta.roomId, {
        type: 'QUICK_REPLY_RECEIVED',
        payload: quickReply,
      });
      break;
    }

    case 'SEND_CHAT_MESSAGE': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      const member = room.members.find((m) => m.id === meta.memberId);
      if (!member) return;

      const { text, targetRole, isNotice } = event.payload;
      if (!text || !text.trim()) return;

      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderId: member.id,
        senderName: member.name,
        senderRole: member.role,
        isLeader: member.isLeader,
        text: text.trim(),
        timestamp: Date.now(),
        targetRole: targetRole || 'ALL',
        isNotice: !!isNotice,
      };

      if (!room.messages) {
        room.messages = [];
      }
      room.messages.push(chatMessage);
      if (room.messages.length > 150) {
        room.messages = room.messages.slice(-150);
      }

      broadcastToRoom(meta.roomId, {
        type: 'CHAT_MESSAGE_RECEIVED',
        payload: chatMessage,
      });
      break;
    }

    case 'CLEAR_MESSAGES': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.messages = [];
      broadcastToRoom(meta.roomId, {
        type: 'MESSAGES_CLEARED',
      });
      break;
    }

    case 'CLEAR_ACTIVE_CUE': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.activeCue = null;
      broadcastToRoom(meta.roomId, {
        type: 'CUE_CLEARED',
      });
      break;
    }

    case 'SET_CURRENT_SONG': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.currentSongIndex = event.payload.index;
      broadcastToRoom(meta.roomId, {
        type: 'SONG_CHANGED',
        payload: { currentSongIndex: room.currentSongIndex },
      });
      break;
    }

    case 'UPDATE_SONGS': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.songs = event.payload.songs;
      broadcastToRoom(meta.roomId, {
        type: 'SONG_CHANGED',
        payload: { currentSongIndex: room.currentSongIndex, songs: room.songs },
      });
      break;
    }

    case 'SET_CURRENT_PRAYER': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.currentPrayerTopicIndex = event.payload.index;
      broadcastToRoom(meta.roomId, {
        type: 'PRAYER_CHANGED',
        payload: { currentPrayerTopicIndex: room.currentPrayerTopicIndex },
      });
      break;
    }

    case 'UPDATE_PRAYER_TOPICS': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.prayerTopics = event.payload.topics;
      broadcastToRoom(meta.roomId, {
        type: 'PRAYER_CHANGED',
        payload: { currentPrayerTopicIndex: room.currentPrayerTopicIndex, topics: room.prayerTopics },
      });
      break;
    }

    case 'START_PRAYER_TIMER': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      const { totalSeconds, label } = event.payload;
      room.prayerTimer = {
        active: true,
        totalSeconds,
        remainingSeconds: totalSeconds,
        startedAt: Date.now(),
        label,
      };

      broadcastToRoom(meta.roomId, {
        type: 'TIMER_UPDATED',
        payload: room.prayerTimer,
      });
      break;
    }

    case 'STOP_PRAYER_TIMER': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.prayerTimer = null;
      broadcastToRoom(meta.roomId, {
        type: 'TIMER_UPDATED',
        payload: null,
      });
      break;
    }

    case 'ADD_CUSTOM_PRESET': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.customPresets.push(event.payload.preset);
      broadcastToRoom(meta.roomId, {
        type: 'PRESETS_UPDATED',
        payload: room.customPresets,
      });
      break;
    }

    case 'DELETE_CUSTOM_PRESET': {
      const meta = socketMeta.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomId);
      if (!room) return;

      room.customPresets = room.customPresets.filter((p) => p.id !== event.payload.presetId);
      broadcastToRoom(meta.roomId, {
        type: 'PRESETS_UPDATED',
        payload: room.customPresets,
      });
      break;
    }

    case 'PING': {
      ws.send(JSON.stringify({ type: 'PONG' }));
      break;
    }
  }
}

// Timer countdown loop
setInterval(() => {
  rooms.forEach((room, roomId) => {
    if (room.prayerTimer && room.prayerTimer.active) {
      const elapsed = Math.floor((Date.now() - (room.prayerTimer.startedAt || Date.now())) / 1000);
      const remaining = Math.max(0, room.prayerTimer.totalSeconds - elapsed);
      room.prayerTimer.remainingSeconds = remaining;

      if (remaining === 0) {
        room.prayerTimer.active = false;
      }

      broadcastToRoom(roomId, {
        type: 'TIMER_UPDATED',
        payload: room.prayerTimer,
      });
    }
  });
}, 1000);

// Vite & Static file setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[PraiseCue] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
