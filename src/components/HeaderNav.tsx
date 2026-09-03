import React from 'react';
import { Member, UserRole, PrayerTimerState, AppViewMode, LeaderNavTab } from '../types';
import { ROLE_INFOS } from '../data/presets';
import { IconRenderer } from './IconRenderer';
import {
  Users,
  Share2,
  Settings,
  Clock,
  LogOut,
  MessageSquare,
  BookOpen,
  LayoutGrid,
  Eye,
  Radio,
  Search,
} from 'lucide-react';

interface HeaderNavProps {
  roomName: string;
  connected: boolean;
  memberCount: number;
  members: Member[];
  myRole: UserRole;
  myName: string;
  isLeader: boolean;
  viewMode: LeaderNavTab;
  onChangeViewMode: (mode: LeaderNavTab) => void;
  prayerTimer: PrayerTimerState | null;
  unreadChatCount?: number;
  onOpenChat: () => void;
  onOpenSongDirectory?: () => void;
  onOpenTimerModal: () => void;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onOpenMembersList: () => void;
  onLeave: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  roomName,
  connected,
  memberCount,
  myRole,
  myName,
  isLeader,
  viewMode,
  onChangeViewMode,
  prayerTimer,
  unreadChatCount = 0,
  onOpenChat,
  onOpenSongDirectory,
  onOpenTimerModal,
  onOpenShare,
  onOpenSettings,
  onOpenMembersList,
  onLeave,
}) => {
  const roleInfo = ROLE_INFOS[myRole];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-2.5 py-1.5 sm:px-4 sm:py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
        {/* Top Row on Mobile: Room & Role info on Left, Actions on Right */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          {/* Left: Room & Role Info */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-bold text-neutral-100 truncate max-w-[100px] sm:max-w-[140px]">
                {roomName}
              </span>
              <button
                type="button"
                onClick={onOpenMembersList}
                className="flex items-center gap-0.5 text-[11px] text-neutral-400 bg-neutral-800 hover:text-white px-1.5 py-0.5 rounded transition cursor-pointer"
                title="접속자 목록"
              >
                <Users className="w-3 h-3 text-amber-400" />
                <span>{memberCount}</span>
              </button>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs">
              <div className={`p-1 rounded ${roleInfo.color.split(' ')[0]}`}>
                <IconRenderer name={roleInfo.icon} className="w-3 h-3 text-amber-300" />
              </div>
              <span className="font-semibold text-neutral-200 truncate max-w-[70px] sm:max-w-[90px]">{myName}</span>
              <span className="text-[10px] text-neutral-400 hidden xs:inline">({roleInfo.label})</span>
            </div>
          </div>

          {/* Right on Mobile: Timer, Chat, Settings, Leave */}
          <div className="flex items-center gap-1 sm:hidden">
            {/* Live Timer if active */}
            {prayerTimer && prayerTimer.active && (
              <button
                type="button"
                onClick={onOpenTimerModal}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold transition animate-pulse border ${
                  prayerTimer.remainingSeconds <= 60
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{formatTimer(prayerTimer.remainingSeconds)}</span>
              </button>
            )}

            {/* Live Chat Drawer */}
            <button
              type="button"
              onClick={onOpenChat}
              className="relative p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="실시간 팀 메시지"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              {unreadChatCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-1 rounded-full animate-bounce shadow-sm">
                  {unreadChatCount > 99 ? '99+' : unreadChatCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              title="설정"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Leave */}
            <button
              type="button"
              onClick={onLeave}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-800/60 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
              title="나가기"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Full-width 1 row on mobile portrait, center bar on desktop/tablet */}
        <div
          className={`w-full sm:w-auto grid ${
            isLeader ? 'grid-cols-4' : 'grid-cols-3'
          } sm:flex sm:items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0`}
        >
          <button
            type="button"
            onClick={() => onChangeViewMode('INTEGRATED')}
            className={`px-2 py-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
              viewMode === 'INTEGRATED'
                ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="통합뷰어: 악보와 신호/목록을 함께 보기"
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">통합뷰어</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('SCORE_ONLY')}
            className={`px-2 py-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
              viewMode === 'SCORE_ONLY'
                ? 'bg-indigo-500 text-white font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="악보만: 악보 화면에 집중하기"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">악보만</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('CUE_ONLY')}
            className={`px-2 py-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
              viewMode === 'CUE_ONLY'
                ? 'bg-cyan-500 text-neutral-950 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="신호만: 실시간 큐 신호 및 빠른 응답 집중"
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">신호만</span>
          </button>

          {/* Leader-only Song Index tab (Hidden on receiver) */}
          {isLeader && (
            <button
              type="button"
              onClick={() => onChangeViewMode('SONG_INDEX')}
              className={`px-2 py-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                viewMode === 'SONG_INDEX'
                  ? 'bg-emerald-500 text-neutral-950 font-black shadow-sm'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40'
              }`}
              title="찬양색인: 코드 및 자음 검색으로 곡 전환"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">찬양색인</span>
            </button>
          )}
        </div>

        {/* Right on Desktop/Tablet: Timer & Tools & Actions */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
          {/* Live Timer if active */}
          {prayerTimer && prayerTimer.active && (
            <button
              type="button"
              onClick={onOpenTimerModal}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition animate-pulse border ${
                prayerTimer.remainingSeconds <= 60
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(prayerTimer.remainingSeconds)}</span>
              <span className="text-[10px] font-sans font-normal opacity-80 hidden lg:inline truncate max-w-[70px]">
                {prayerTimer.label}
              </span>
            </button>
          )}

          {/* Live Chat Drawer */}
          <button
            type="button"
            onClick={onOpenChat}
            className="relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="실시간 팀 메시지"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">팀 메시지</span>
            {unreadChatCount > 0 && (
              <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce shadow-sm">
                {unreadChatCount > 99 ? '99+' : unreadChatCount}
              </span>
            )}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={onOpenShare}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            title="초대 / QR 코드"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            title="설정"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Leave */}
          <button
            type="button"
            onClick={onLeave}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-800/60 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
            title="나가기"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
