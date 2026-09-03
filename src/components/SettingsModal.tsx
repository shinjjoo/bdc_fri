import React, { useState, useEffect } from 'react';
import { Member, UserRole } from '../types';
import { ROLE_INFOS } from '../data/presets';
import { soundManager } from '../utils/audioVibration';
import { IconRenderer } from './IconRenderer';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Sun,
  Users,
  Check,
  Shield,
  Radio,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  myRole: UserRole;
  myName: string;
  isLeader: boolean;
  onChangeRole: (role: UserRole, isLeader: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  members,
  myRole,
  myName,
  isLeader,
  onChangeRole,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibeEnabled, setVibeEnabled] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.soundEnabled = next;
    if (next) {
      soundManager.playNormalCue();
    }
  };

  const toggleVibe = () => {
    const next = !vibeEnabled;
    setVibeEnabled(next);
    soundManager.vibrationEnabled = next;
    if (next) {
      soundManager.vibrate([100, 50, 100]);
    }
  };

  const toggleWakeLock = async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      if (wakeLockActive && wakeLockSentinel) {
        await wakeLockSentinel.release();
        setWakeLockSentinel(null);
        setWakeLockActive(false);
      } else {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        setWakeLockSentinel(sentinel);
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      }
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">앱 설정 및 접속자</h3>
              <p className="text-xs text-neutral-400">알림음, 화면 유지, 포지션 변경</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Alerts & Screen Keep Awake Settings */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            알림 및 화면 제어
          </span>

          {/* Sound Alert Toggle */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${soundEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-500'}`}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">신호 수신음 (Web Audio)</h4>
                <p className="text-[11px] text-neutral-400">새로운 신호 시 차임벨 재생</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => soundManager.playPrayerBell()}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-amber-300 px-2 py-1 rounded-lg border border-neutral-700"
              >
                테스트
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className={`w-11 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-amber-500' : 'bg-neutral-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Vibration Toggle */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${vibeEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">모바일 진동 피드백</h4>
                <p className="text-[11px] text-neutral-400">신호 도착 시 햅틱 진동</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleVibe}
              className={`w-11 h-6 rounded-full transition-colors relative ${vibeEnabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${vibeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Wake Lock */}
          {wakeLockSupported && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${wakeLockActive ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-500'}`}>
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">악보대 화면 꺼짐 방지 (Wake Lock)</h4>
                  <p className="text-[11px] text-neutral-400">기도회 동안 화면 켜짐 유지</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleWakeLock}
                className={`w-11 h-6 rounded-full transition-colors relative ${wakeLockActive ? 'bg-blue-500' : 'bg-neutral-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${wakeLockActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          )}
        </div>

        {/* 2. Position / Role Switch */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            내 포지션 변경
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(ROLE_INFOS) as UserRole[]).map((rKey) => {
              const info = ROLE_INFOS[rKey];
              const isSelected = myRole === rKey;
              return (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => onChangeRole(rKey, rKey === 'LEADER')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <IconRenderer name={info.icon} className="w-3.5 h-3.5" />
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Connected Members */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              실시간 접속자 ({members.length}명)
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse" />
              연결됨
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {members.map((m) => {
              const info = ROLE_INFOS[m.role];
              return (
                <div
                  key={m.id}
                  className="bg-neutral-950 border border-neutral-800/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${info?.color.split(' ')[0] || 'bg-neutral-800'}`}>
                      <IconRenderer name={info?.icon || 'Users'} className="w-3 h-3 text-amber-300" />
                    </div>
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="text-[10px] text-neutral-400">({info?.label})</span>
                  </div>
                  {m.isLeader && (
                    <span className="text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      인도자
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
