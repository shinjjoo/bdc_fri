import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_INFOS } from '../data/presets';
import { IconRenderer } from './IconRenderer';
import { Sparkles, Radio, Shield, Users, ArrowRight, Volume2, Music, Check } from 'lucide-react';

interface LobbyViewProps {
  onJoin: (data: { roomId: string; roomName: string; name: string; role: UserRole; isLeader: boolean }) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ onJoin }) => {
  const [roomId] = useState('금요기도회');
  const [role, setRole] = useState<UserRole>('LEADER');
  const [name, setName] = useState('');
  const [isLeader, setIsLeader] = useState(true);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'LEADER') {
      setIsLeader(true);
    } else {
      setIsLeader(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `${ROLE_INFOS[role].label} ${Math.floor(Math.random() * 90 + 10)}`;
    onJoin({
      roomId: '금요기도회',
      roomName: '금요기도회',
      name: finalName,
      role,
      isLeader: role === 'LEADER' || isLeader,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="pt-4 sm:pt-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>금요기도회 전용 실시간 큐 사인 & 찬양 색인</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <span>금요기도회 찬양팀 큐</span>
          <span className="text-xs bg-neutral-800 text-neutral-400 font-mono px-2 py-0.5 rounded border border-neutral-700">
            PraiseCue
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
          기도회 중 소리와 손짓 없이도 코드별/번호별 찬양 진행과 큐 신호를 실시간으로 주고받습니다.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="my-6 space-y-5 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm">
        {/* Room Selection (Fixed to 금요기도회) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              예배 / 기도회 방
            </span>
            <span className="text-[11px] text-amber-400 font-bold">금요기도회 전용</span>
          </label>
          
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>금요기도회</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded">
                    온라인 자동 접속
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  찬양집 98~101p 색인(G/C/E 코드 및 번호 검색) 탑재
                </p>
              </div>
            </div>
            <Check className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            내 포지션 / 역할 선택
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ROLE_INFOS) as UserRole[]).map((rKey) => {
              const info = ROLE_INFOS[rKey];
              const isSelected = role === rKey;
              return (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => handleRoleSelect(rKey)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-neutral-800 border-amber-400 text-amber-300 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/5 scale-[1.02]'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mb-1 ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    <IconRenderer name={info.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold leading-tight">{info.label}</span>
                  <span className="text-[10px] text-neutral-500 truncate max-w-[85px]">{info.englishLabel.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-between">
            <span>이름 / 닉네임</span>
            <span className="text-[11px] text-neutral-500">선택사항</span>
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`예: ${ROLE_INFOS[role].label} 김찬양`}
            className="w-full bg-neutral-950 border border-neutral-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder-neutral-500 outline-none transition"
          />
        </div>

        {/* Mode Preview Badge */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${role === 'LEADER' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-neutral-300">
              {role === 'LEADER' ? '인도자 신호 발송 컨트롤 패널' : '찬양팀 대형 악보대 HUD 모드'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">실시간 연동</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="join-room-btn"
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 text-sm"
        >
          <span>기도회 신호 큐 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Feature Highlights Footer */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-500 pb-2">
        <div className="p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40 flex flex-col items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>신호음 & 진동 알림</span>
        </div>
        <div className="p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40 flex flex-col items-center gap-1">
          <Music className="w-3.5 h-3.5 text-neutral-400" />
          <span>악보대 전용 HUD</span>
        </div>
        <div className="p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40 flex flex-col items-center gap-1">
          <Check className="w-3.5 h-3.5 text-neutral-400" />
          <span>수신 확인(OK) 체크</span>
        </div>
      </div>
    </div>
  );
};
