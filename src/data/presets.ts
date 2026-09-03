import { QuickPreset, RoleInfo, UserRole, SongItem, PrayerTopic } from '../types';

export const ROLE_INFOS: Record<UserRole, RoleInfo> = {
  LEADER: {
    role: 'LEADER',
    label: '인도자',
    englishLabel: 'Worship Leader',
    icon: 'Mic',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  PIANO: {
    role: 'PIANO',
    label: '메인건반',
    englishLabel: 'Piano / Main Keys',
    icon: 'Music2',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  SYNTH: {
    role: 'SYNTH',
    label: '세컨건반',
    englishLabel: 'Synth / Strings',
    icon: 'Layers',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  ACOUSTIC: {
    role: 'ACOUSTIC',
    label: '어쿠스틱',
    englishLabel: 'Acoustic Guitar',
    icon: 'Guitar',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
  ELECTRIC: {
    role: 'ELECTRIC',
    label: '일렉기타',
    englishLabel: 'Electric Guitar',
    icon: 'Zap',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  },
  BASS: {
    role: 'BASS',
    label: '베이스',
    englishLabel: 'Bass Guitar',
    icon: 'Radio',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  DRUM: {
    role: 'DRUM',
    label: '드럼',
    englishLabel: 'Drums / Percussion',
    icon: 'Disc',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  VOCAL: {
    role: 'VOCAL',
    label: '싱어/보컬',
    englishLabel: 'Vocal / Choir',
    icon: 'UserCheck',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  BROADCAST: {
    role: 'BROADCAST',
    label: '방송실/자막',
    englishLabel: 'Media / Sound Tech',
    icon: 'Tv',
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  MEMBER: {
    role: 'MEMBER',
    label: '찬양팀원',
    englishLabel: 'Team Member',
    icon: 'Users',
    color: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40',
  },
};

export const DEFAULT_PRESETS: QuickPreset[] = [
  {
    id: 'chorus_repeat',
    title: '후렴 반복',
    category: 'SONG_FLOW',
    color: 'amber',
    icon: 'Repeat',
    urgency: 'NORMAL',
  },
  {
    id: 'free_loop',
    title: '무한 반복',
    category: 'SONG_FLOW',
    color: 'indigo',
    icon: 'Infinity',
    urgency: 'NORMAL',
  },
  {
    id: 'to_ment',
    title: '멘트로 전환',
    category: 'SONG_FLOW',
    color: 'purple',
    icon: 'Mic',
    urgency: 'NORMAL',
  },
  {
    id: 'to_prayer',
    title: '기도로 전환',
    category: 'PRAYER',
    color: 'rose',
    icon: 'Flame',
    urgency: 'URGENT',
  },
  {
    id: 'to_praise',
    title: '찬양으로 전환',
    category: 'SONG_FLOW',
    color: 'cyan',
    icon: 'Music',
    urgency: 'NORMAL',
  },
  {
    id: 'ending_ready',
    title: '종료 준비',
    category: 'SONG_FLOW',
    color: 'orange',
    icon: 'Hourglass',
    urgency: 'HIGH',
  },
];

export const SAMPLE_SONGS: SongItem[] = [
  {
    id: 's1',
    title: '주 은혜가 나에게 족하네',
    key: 'G',
  },
  {
    id: 's2',
    title: '원하고 바라고 기도합니다',
    key: 'A',
  },
  {
    id: 's3',
    title: '꽃들도',
    key: 'E',
  },
];

export const SAMPLE_PRAYER_TOPICS: PrayerTopic[] = [];
