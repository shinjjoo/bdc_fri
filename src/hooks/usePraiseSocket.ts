import { useEffect, useRef, useState, useCallback } from 'react';
import {
  RoomState,
  UserRole,
  ClientToServerEvent,
  ServerToClientEvent,
  CueSignal,
  QuickReply,
  SongItem,
  PrayerTopic,
  QuickPreset,
  ChatMessage,
} from '../types';
import { soundManager } from '../utils/audioVibration';

interface UsePraiseSocketOptions {
  roomId: string;
  roomName?: string;
  name: string;
  role: UserRole;
  isLeader: boolean;
  enabled: boolean;
}

export function usePraiseSocket({
  roomId,
  roomName,
  name,
  role,
  isLeader,
  enabled,
}: UsePraiseSocketOptions) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [myMemberId, setMyMemberId] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [lastReceivedCue, setLastReceivedCue] = useState<CueSignal | null>(null);
  const [incomingReplyToast, setIncomingReplyToast] = useState<QuickReply | null>(null);
  const [latestChatMessage, setLatestChatMessage] = useState<ChatMessage | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  // Send typed payload through websocket
  const send = useCallback((event: ClientToServerEvent) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(event));
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !roomId) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      if (!isComponentMounted.current) return;
      setConnected(true);
      // Join Room
      const joinMsg: ClientToServerEvent = {
        type: 'JOIN_ROOM',
        payload: {
          roomId,
          roomName: roomName || roomId,
          name,
          role,
          isLeader,
        },
      };
      ws.send(JSON.stringify(joinMsg));
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted.current) return;
      try {
        const data = JSON.parse(event.data) as ServerToClientEvent;
        handleServerMessage(data);
      } catch (err) {
        console.error('Failed to parse websocket message', err);
      }
    };

    ws.onclose = () => {
      if (!isComponentMounted.current) return;
      setConnected(false);
      // Auto reconnect after 2s
      if (enabled) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      }
    };

    ws.onerror = (err) => {
      console.warn('WebSocket error:', err);
      ws.close();
    };
  }, [enabled, roomId, roomName, name, role, isLeader]);

  const handleServerMessage = (data: ServerToClientEvent) => {
    switch (data.type) {
      case 'ROOM_STATE': {
        setRoomState(data.payload);
        if (data.payload.myMemberId) {
          setMyMemberId(data.payload.myMemberId);
        }
        if (data.payload.activeCue) {
          setLastReceivedCue(data.payload.activeCue);
        }
        break;
      }

      case 'CUE_RECEIVED': {
        const cue = data.payload;
        setLastReceivedCue(cue);
        setRoomState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            activeCue: cue,
            cueHistory: [cue, ...(prev.cueHistory || []).filter((c) => c.id !== cue.id)].slice(0, 60),
          };
        });

        // Trigger Screen Flash Visual Alert
        setFlashScreen(true);
        setTimeout(() => setFlashScreen(false), 500);

        // Sound & Vibration Trigger
        if (cue.category === 'PRAYER') {
          soundManager.playPrayerBell();
        } else if (cue.urgency === 'URGENT') {
          soundManager.playUrgentCue();
        } else if (cue.urgency === 'HIGH') {
          soundManager.playHighCue();
        } else {
          soundManager.playNormalCue();
        }
        break;
      }

      case 'CUE_ACKED': {
        const { cueId, acknowledgment } = data.payload;
        setRoomState((prev) => {
          if (!prev || !prev.activeCue || prev.activeCue.id !== cueId) return prev;
          const exists = prev.activeCue.acknowledgedBy.some(
            (a) => a.memberId === acknowledgment.memberId || a.memberName === acknowledgment.memberName
          );
          if (exists) return prev;
          return {
            ...prev,
            activeCue: {
              ...prev.activeCue,
              acknowledgedBy: [...prev.activeCue.acknowledgedBy, acknowledgment],
            },
          };
        });
        soundManager.playAckPing();
        break;
      }

      case 'QUICK_REPLY_RECEIVED': {
        const reply = data.payload;
        setIncomingReplyToast(reply);
        setTimeout(() => setIncomingReplyToast(null), 3500);

        setRoomState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentReplies: [reply, ...(prev.recentReplies || [])].slice(0, 20),
          };
        });
        soundManager.playAckPing();
        break;
      }

      case 'CHAT_MESSAGE_RECEIVED': {
        const msg = data.payload;
        setLatestChatMessage(msg);
        setTimeout(() => {
          setLatestChatMessage((curr) => (curr?.id === msg.id ? null : curr));
        }, 5000);

        setUnreadMessageCount((c) => c + 1);

        setRoomState((prev) => {
          if (!prev) return prev;
          const prevMessages = prev.messages || [];
          return {
            ...prev,
            messages: [...prevMessages, msg].slice(-150),
          };
        });

        soundManager.playMessagePing();
        break;
      }

      case 'MESSAGES_CLEARED': {
        setRoomState((prev) => (prev ? { ...prev, messages: [] } : prev));
        setUnreadMessageCount(0);
        break;
      }

      case 'CUE_CLEARED': {
        setRoomState((prev) => (prev ? { ...prev, activeCue: null } : prev));
        break;
      }

      case 'MEMBER_JOINED': {
        setRoomState((prev) => {
          if (!prev) return prev;
          const withoutNew = prev.members.filter((m) => m.id !== data.payload.id);
          return {
            ...prev,
            members: [...withoutNew, data.payload],
          };
        });
        break;
      }

      case 'MEMBER_LEFT': {
        setRoomState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            members: prev.members.filter((m) => m.id !== data.payload.memberId),
          };
        });
        break;
      }

      case 'SONG_CHANGED': {
        setRoomState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentSongIndex: data.payload.currentSongIndex,
            songs: data.payload.songs || prev.songs,
          };
        });
        break;
      }

      case 'PRAYER_CHANGED': {
        setRoomState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentPrayerTopicIndex: data.payload.currentPrayerTopicIndex,
            prayerTopics: data.payload.topics || prev.prayerTopics,
          };
        });
        break;
      }

      case 'TIMER_UPDATED': {
        setRoomState((prev) => (prev ? { ...prev, prayerTimer: data.payload } : prev));
        break;
      }

      case 'PRESETS_UPDATED': {
        setRoomState((prev) => (prev ? { ...prev, customPresets: data.payload } : prev));
        break;
      }
    }
  };

  useEffect(() => {
    isComponentMounted.current = true;
    connect();

    return () => {
      isComponentMounted.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Action Methods
  const sendCue = useCallback(
    (cueData: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'>) => {
      send({
        type: 'SEND_CUE',
        payload: { cue: cueData },
      });
    },
    [send]
  );

  const ackCue = useCallback(
    (cueId: string) => {
      // Immediate optimistic update for zero delay feedback
      setRoomState((prev) => {
        if (!prev || !prev.activeCue) return prev;
        const already = prev.activeCue.acknowledgedBy.some(
          (a) => a.memberName === name || (myMemberId && a.memberId === myMemberId)
        );
        if (already) return prev;
        return {
          ...prev,
          activeCue: {
            ...prev.activeCue,
            acknowledgedBy: [
              ...prev.activeCue.acknowledgedBy,
              {
                memberId: myMemberId || name || 'me',
                memberName: name || '나',
                memberRole: role,
                timestamp: Date.now(),
              },
            ],
          },
        };
      });

      send({
        type: 'ACK_CUE',
        payload: { cueId },
      });
      soundManager.playAckPing();
    },
    [send, name, role, myMemberId]
  );

  const sendQuickReply = useCallback(
    (cueId: string, replyType: QuickReply['type'], message?: string) => {
      send({
        type: 'SEND_QUICK_REPLY',
        payload: { cueId, type: replyType, message },
      });
    },
    [send]
  );

  const clearActiveCue = useCallback(() => {
    send({ type: 'CLEAR_ACTIVE_CUE' });
  }, [send]);

  const setCurrentSong = useCallback(
    (index: number) => {
      send({
        type: 'SET_CURRENT_SONG',
        payload: { index },
      });
    },
    [send]
  );

  const updateSongs = useCallback(
    (songs: SongItem[]) => {
      send({
        type: 'UPDATE_SONGS',
        payload: { songs },
      });
    },
    [send]
  );

  const setCurrentPrayer = useCallback(
    (index: number) => {
      send({
        type: 'SET_CURRENT_PRAYER',
        payload: { index },
      });
    },
    [send]
  );

  const updatePrayerTopics = useCallback(
    (topics: PrayerTopic[]) => {
      send({
        type: 'UPDATE_PRAYER_TOPICS',
        payload: { topics },
      });
    },
    [send]
  );

  const startPrayerTimer = useCallback(
    (totalSeconds: number, label: string) => {
      send({
        type: 'START_PRAYER_TIMER',
        payload: { totalSeconds, label },
      });
    },
    [send]
  );

  const stopPrayerTimer = useCallback(() => {
    send({ type: 'STOP_PRAYER_TIMER' });
  }, [send]);

  const addCustomPreset = useCallback(
    (preset: QuickPreset) => {
      send({
        type: 'ADD_CUSTOM_PRESET',
        payload: { preset },
      });
    },
    [send]
  );

  const deleteCustomPreset = useCallback(
    (presetId: string) => {
      send({
        type: 'DELETE_CUSTOM_PRESET',
        payload: { presetId },
      });
    },
    [send]
  );

  const sendChatMessage = useCallback(
    (text: string, targetRole?: UserRole | 'ALL', isNotice?: boolean) => {
      send({
        type: 'SEND_CHAT_MESSAGE',
        payload: { text, targetRole, isNotice },
      });
    },
    [send]
  );

  const clearMessages = useCallback(() => {
    send({ type: 'CLEAR_MESSAGES' });
  }, [send]);

  const resetUnreadCount = useCallback(() => {
    setUnreadMessageCount(0);
  }, []);

  return {
    roomState,
    myMemberId,
    connected,
    flashScreen,
    lastReceivedCue,
    incomingReplyToast,
    latestChatMessage,
    unreadMessageCount,
    sendCue,
    ackCue,
    sendQuickReply,
    sendChatMessage,
    clearMessages,
    resetUnreadCount,
    clearActiveCue,
    setCurrentSong,
    updateSongs,
    setCurrentPrayer,
    updatePrayerTopics,
    startPrayerTimer,
    stopPrayerTimer,
    addCustomPreset,
    deleteCustomPreset,
  };
}
