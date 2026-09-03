/**
 * PraiseCue (찬양팀 실시간 신호 큐)
 * 교회 기도회 및 찬양 시간에 인도자와 찬양팀 밴드 간의 실시간 신호 교환 시스템
 */

import React, { useState, useEffect } from 'react';
import { UserRole, SongItem, QuickPreset, AppViewMode } from './types';
import { usePraiseSocket } from './hooks/usePraiseSocket';
import { LobbyView } from './components/LobbyView';
import { HeaderNav } from './components/HeaderNav';
import { ActiveCueBanner } from './components/ActiveCueBanner';
import { LeaderScoreMode } from './components/LeaderScoreMode';
import { BandHUDView } from './components/BandHUDView';
import { ShareRoomModal } from './components/ShareRoomModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomPresetModal } from './components/CustomPresetModal';
import { TimerModal } from './components/TimerModal';
import { LiveChatDrawer } from './components/LiveChatDrawer';
import { LiveChatToast } from './components/LiveChatToast';
import { FridaySongDirectoryModal } from './components/FridaySongDirectoryModal';
import { ROLE_INFOS } from './data/presets';
import { Check } from 'lucide-react';

export default function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('금요기도회');
  const [roomName, setRoomName] = useState('금요기도회');
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<UserRole>('LEADER');
  const [isLeader, setIsLeader] = useState(true);

  // App View Mode (Default: INTEGRATED with PDF scorebook)
  const [viewMode, setViewMode] = useState<AppViewMode>('INTEGRATED');
  const [currentScorePage, setCurrentScorePage] = useState<number>(1);

  // Modals & Drawers
  const [showSongDirectory, setShowSongDirectory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChatToast, setActiveChatToast] = useState<any>(null);

  // Parse URL query parameter ?room=xxx if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setRoomId(roomParam);
        setRoomName(roomParam);
      }
    }
  }, []);

  // WebSocket Hook
  const {
    roomState,
    myMemberId,
    connected,
    flashScreen,
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
    startPrayerTimer,
    stopPrayerTimer,
    addCustomPreset,
    deleteCustomPreset,
  } = usePraiseSocket({
    roomId,
    roomName,
    name: userName,
    role,
    isLeader,
    enabled: joined,
  });

  // Track latest chat message for toast banner when chat drawer is closed
  useEffect(() => {
    if (latestChatMessage && !showChat) {
      setActiveChatToast(latestChatMessage);
    }
  }, [latestChatMessage, showChat]);

  const handleOpenChat = () => {
    setShowChat(true);
    setActiveChatToast(null);
    resetUnreadCount();
  };

  const handleCloseChat = () => {
    setShowChat(false);
    resetUnreadCount();
  };

  const handleJoin = (data: {
    roomId: string;
    roomName: string;
    name: string;
    role: UserRole;
    isLeader: boolean;
  }) => {
    setRoomId(data.roomId);
    setRoomName(data.roomName);
    setUserName(data.name);
    setRole(data.role);
    setIsLeader(data.isLeader);
    setViewMode('INTEGRATED'); // Default to Integrated PDF score mode for all users!
    setJoined(true);
  };

  const handleLeave = () => {
    setJoined(false);
  };

  const handleChangeRole = (newRole: UserRole, newIsLeader: boolean) => {
    setRole(newRole);
    setIsLeader(newIsLeader);
    if (!newIsLeader && viewMode === 'SONG_INDEX') {
      setViewMode('INTEGRATED');
    }
  };

  if (!joined) {
    return <LobbyView onJoin={handleJoin} />;
  }

  const songs = roomState?.songs || [];
  const currentSongIndex = roomState?.currentSongIndex ?? 0;
  const currentSong = songs[currentSongIndex] || null;
  const nextSong = songs[currentSongIndex + 1] || null;

  const presets = roomState?.customPresets || [];
  const members = roomState?.members || [];
  const activeCue = roomState?.activeCue || null;
  const prayerTimer = roomState?.prayerTimer || null;
  const cueHistory = roomState?.cueHistory || [];
  const recentReplies = roomState?.recentReplies || [];
  const messages = roomState?.messages || [];

  // Helper for choosing a catalog song as active song
  const handleSelectCatalogSongAsCurrent = (songItem: SongItem) => {
    const existingIdx = songs.findIndex(
      (s) => s.title.trim() === songItem.title.trim() && (!songItem.key || s.key === songItem.key)
    );
    if (existingIdx >= 0) {
      setCurrentSong(existingIdx);
    } else {
      const updated = [...songs, songItem];
      updateSongs(updated);
      setCurrentSong(updated.length - 1);
    }
  };

  const handleAddCatalogSongToSetlist = (songItem: SongItem) => {
    updateSongs([...songs, songItem]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Visual Flash Alert on new Cue */}
      {flashScreen && (
        <div className="fixed inset-0 z-[100] bg-amber-400/20 backdrop-brightness-150 pointer-events-none transition-opacity duration-300 animate-pulse" />
      )}

      {/* Real-time Chat Toast Banner */}
      <LiveChatToast
        message={activeChatToast}
        onOpenChat={handleOpenChat}
        onDismiss={() => setActiveChatToast(null)}
      />

      {/* Floating Toast for Quick Replies from Band Members */}
      {incomingReplyToast && (
        <div className="fixed top-16 right-4 z-40 bg-neutral-900 border border-neutral-700 rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 max-w-sm">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>{incomingReplyToast.senderName}</span>
              <span className="text-[10px] text-neutral-400">
                ({ROLE_INFOS[incomingReplyToast.senderRole]?.label})
              </span>
            </div>
            <p className="text-xs text-amber-300 font-semibold truncate">
              {incomingReplyToast.message}
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar with View Mode Tabs */}
      <HeaderNav
        roomName={roomName}
        connected={connected}
        memberCount={members.length}
        members={members}
        myRole={role}
        myName={userName}
        isLeader={isLeader}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        prayerTimer={prayerTimer}
        unreadChatCount={unreadMessageCount}
        onOpenChat={handleOpenChat}
        onOpenSongDirectory={() => setViewMode('SONG_INDEX')}
        onOpenTimerModal={() => setShowTimer(true)}
        onOpenShare={() => setShowShare(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenMembersList={() => setShowSettings(true)}
        onLeave={handleLeave}
      />

      {/* Sticky Real-Time Active Cue Banner with '해당 곡으로 이동' and '확인 완료' */}
      {!( !isLeader && viewMode === 'SCORE_ONLY' ) && (
        <div className="sticky top-[86px] sm:top-[57px] z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-2 sm:px-4 py-1.5 shadow-xl transition-all">
          <div className="max-w-7xl mx-auto w-full">
            <ActiveCueBanner
              cue={activeCue}
              myMemberId={myMemberId || userName}
              myName={userName}
              isLeader={isLeader}
              members={members}
              onAck={ackCue}
              onClear={clearActiveCue}
              onJumpToPage={(p) => setCurrentScorePage(p)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area based on User Role & Selected View Mode */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-1.5 sm:p-3">
        {isLeader ? (
          /* Leader Dashboard with Selected View Mode */
          <LeaderScoreMode
            viewMode={viewMode}
            currentPage={currentScorePage}
            onPageChange={setCurrentScorePage}
            songs={songs}
            currentSong={currentSong}
            currentSongIndex={currentSongIndex}
            activeCue={activeCue}
            members={members}
            myMemberId={myMemberId || userName}
            senderName={userName}
            onSendCue={sendCue}
            onClearActiveCue={clearActiveCue}
            onAck={ackCue}
            onQuickReply={sendQuickReply}
            onSetCurrentSong={setCurrentSong}
            onSelectCatalogSongAsCurrent={handleSelectCatalogSongAsCurrent}
          />
        ) : (
          /* Band Member / Receiver Dashboard with Selected View Mode */
          <BandHUDView
            viewMode={viewMode}
            currentScorePage={currentScorePage}
            onPageChange={setCurrentScorePage}
            activeCue={activeCue}
            myMemberId={myMemberId || userName}
            myName={userName}
            members={members}
            currentSong={currentSong}
            onAckCue={ackCue}
            onQuickReply={sendQuickReply}
            onSendChatMessage={(text) => sendChatMessage(text, 'ALL')}
            onOpenChat={handleOpenChat}
          />
        )}
      </main>

      {/* Drawers & Modals */}
      <LiveChatDrawer
        isOpen={showChat}
        onClose={handleCloseChat}
        messages={messages}
        myMemberId={userName}
        myRole={role}
        myName={userName}
        isLeader={isLeader}
        members={members}
        onSendMessage={sendChatMessage}
        onClearMessages={clearMessages}
      />

      <FridaySongDirectoryModal
        isOpen={showSongDirectory}
        onClose={() => setShowSongDirectory(false)}
        onSendCue={sendCue}
        onSelectAsCurrentSong={handleSelectCatalogSongAsCurrent}
        onAddToSetlist={handleAddCatalogSongToSetlist}
        isLeader={isLeader}
        senderName={userName}
      />

      <CustomPresetModal
        isOpen={showAddPreset}
        onClose={() => setShowAddPreset(false)}
        onAddPreset={addCustomPreset}
      />

      <ShareRoomModal
        isOpen={showShare}
        roomId={roomId}
        roomName={roomName}
        onClose={() => setShowShare(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        members={members}
        myRole={role}
        myName={userName}
        isLeader={isLeader}
        onChangeRole={handleChangeRole}
      />

      <TimerModal
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        prayerTimer={prayerTimer}
        onStartTimer={startPrayerTimer}
        onStopTimer={stopPrayerTimer}
      />
    </div>
  );
}
