export type UserRole =
  | 'LEADER'
  | 'PIANO'
  | 'SYNTH'
  | 'ACOUSTIC'
  | 'ELECTRIC'
  | 'BASS'
  | 'DRUM'
  | 'VOCAL'
  | 'BROADCAST'
  | 'MEMBER';

export interface RoleInfo {
  role: UserRole;
  label: string;
  englishLabel: string;
  icon: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  role: UserRole;
  isLeader: boolean;
  connectedAt: number;
  lastSeen: number;
  lastAckCueId?: string;
  color: string;
}

export type CueCategory = 'SONG_FLOW' | 'DYNAMICS' | 'PRAYER' | 'CUSTOM';
export type CueUrgency = 'NORMAL' | 'HIGH' | 'URGENT';

export type AppViewMode = 'INTEGRATED' | 'SCORE_ONLY' | 'CUE_ONLY';
export type LeaderNavTab = 'INTEGRATED' | 'SCORE_ONLY' | 'CUE_ONLY' | 'SONG_INDEX';

export interface CueSignal {
  id: string;
  category: CueCategory;
  title: string;
  subtitle?: string;
  icon?: string;
  color: 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'cyan' | 'red' | 'indigo' | 'orange';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  timestamp: number;
  urgency: CueUrgency;
  note?: string;
  targetPage?: number;
  targetSongTitle?: string;
  targetKey?: string;
  acknowledgedBy: Array<{
    memberId: string;
    memberName: string;
    memberRole: UserRole;
    timestamp: number;
  }>;
}

export interface SongItem {
  id: string;
  title: string;
  key: string;
  tempo?: string;
  notes?: string;
  bpm?: number;
}

export interface PrayerTopic {
  id: string;
  title: string;
  content: string;
  durationMinutes?: number;
}

export interface PrayerTimerState {
  active: boolean;
  totalSeconds: number;
  remainingSeconds: number;
  startedAt: number | null;
  label: string;
}

export interface QuickPreset {
  id: string;
  title: string;
  subtitle?: string;
  category: CueCategory;
  color: 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'cyan' | 'red' | 'indigo' | 'orange';
  icon: string;
  urgency?: CueUrgency;
  defaultNote?: string;
}

export interface QuickReply {
  id: string;
  cueId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: number;
  type: 'OK' | 'READY' | 'REPEAT' | 'KEY_CHECK' | 'CUSTOM';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  isLeader: boolean;
  text: string;
  timestamp: number;
  targetRole?: UserRole | 'ALL';
  isNotice?: boolean;
}

export interface RoomState {
  roomId: string;
  roomName: string;
  createdAt: number;
  myMemberId?: string;
  activeCue: CueSignal | null;
  cueHistory: CueSignal[];
  currentSongIndex: number;
  songs: SongItem[];
  prayerTopics: PrayerTopic[];
  currentPrayerTopicIndex: number;
  prayerTimer: PrayerTimerState | null;
  members: Member[];
  customPresets: QuickPreset[];
  recentReplies: QuickReply[];
  messages: ChatMessage[];
}

export type ClientToServerEvent =
  | { type: 'JOIN_ROOM'; payload: { roomId: string; roomName?: string; name: string; role: UserRole; isLeader: boolean } }
  | { type: 'SEND_CUE'; payload: { cue: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'> } }
  | { type: 'ACK_CUE'; payload: { cueId: string } }
  | { type: 'SEND_QUICK_REPLY'; payload: { cueId: string; type: QuickReply['type']; message?: string } }
  | { type: 'SEND_CHAT_MESSAGE'; payload: { text: string; targetRole?: UserRole | 'ALL'; isNotice?: boolean } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'CLEAR_ACTIVE_CUE' }
  | { type: 'SET_CURRENT_SONG'; payload: { index: number } }
  | { type: 'UPDATE_SONGS'; payload: { songs: SongItem[] } }
  | { type: 'SET_CURRENT_PRAYER'; payload: { index: number } }
  | { type: 'UPDATE_PRAYER_TOPICS'; payload: { topics: PrayerTopic[] } }
  | { type: 'START_PRAYER_TIMER'; payload: { totalSeconds: number; label: string } }
  | { type: 'PAUSE_PRAYER_TIMER' }
  | { type: 'RESUME_PRAYER_TIMER' }
  | { type: 'STOP_PRAYER_TIMER' }
  | { type: 'ADD_CUSTOM_PRESET'; payload: { preset: QuickPreset } }
  | { type: 'DELETE_CUSTOM_PRESET'; payload: { presetId: string } }
  | { type: 'PING' };

export type ServerToClientEvent =
  | { type: 'ROOM_STATE'; payload: RoomState }
  | { type: 'CUE_RECEIVED'; payload: CueSignal }
  | { type: 'CUE_ACKED'; payload: { cueId: string; acknowledgment: CueSignal['acknowledgedBy'][0] } }
  | { type: 'QUICK_REPLY_RECEIVED'; payload: QuickReply }
  | { type: 'CHAT_MESSAGE_RECEIVED'; payload: ChatMessage }
  | { type: 'MESSAGES_CLEARED' }
  | { type: 'CUE_CLEARED' }
  | { type: 'MEMBER_JOINED'; payload: Member }
  | { type: 'MEMBER_LEFT'; payload: { memberId: string } }
  | { type: 'SONG_CHANGED'; payload: { currentSongIndex: number; songs?: SongItem[] } }
  | { type: 'PRAYER_CHANGED'; payload: { currentPrayerTopicIndex: number; topics?: PrayerTopic[] } }
  | { type: 'TIMER_UPDATED'; payload: PrayerTimerState | null }
  | { type: 'PRESETS_UPDATED'; payload: QuickPreset[] }
  | { type: 'PONG' };
