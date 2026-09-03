import React, { useState } from 'react';
import { PrayerTimerState } from '../types';
import { X, Clock, Play, Square, Flame } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTimer: PrayerTimerState | null;
  onStartTimer: (totalSeconds: number, label: string) => void;
  onStopTimer: () => void;
}

const TIMER_PRESETS = [
  { minutes: 1, label: '1분 마무리 기도' },
  { minutes: 3, label: '3분 합심 기도' },
  { minutes: 5, label: '5분 통성 기도' },
  { minutes: 7, label: '7분 집중 기도' },
  { minutes: 10, label: '10분 깊은 기도' },
  { minutes: 15, label: '15분 자유 기도' },
];

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  prayerTimer,
  onStartTimer,
  onStopTimer,
}) => {
  const [customMinutes, setCustomMinutes] = useState('5');
  const [customLabel, setCustomLabel] = useState('통성기도');

  if (!isOpen) return null;

  const handleStartPreset = (minutes: number, label: string) => {
    onStartTimer(minutes * 60, label);
    onClose();
  };

  const handleCustomStart = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseInt(customMinutes, 10) || 5;
    onStartTimer(min * 60, customLabel.trim() || '통성기도');
    onClose();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl space-y-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">기도회 실시간 타이머</h3>
              <p className="text-xs text-neutral-400">모든 찬양팀 화면에 카운트다운 공유</p>
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

        {/* Current Active Timer Status */}
        {prayerTimer && prayerTimer.active ? (
          <div className="bg-neutral-950 border border-amber-500/40 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              진행 중인 기도: {prayerTimer.label}
            </span>
            <div className="text-4xl font-black font-mono text-amber-300 animate-pulse">
              {formatTimer(prayerTimer.remainingSeconds)}
            </div>
            <button
              type="button"
              onClick={() => {
                onStopTimer();
                onClose();
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Square className="w-4 h-4" />
              <span>타이머 정지 / 종료</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block text-left">
              빠른 시간 선택
            </span>
            <div className="grid grid-cols-2 gap-2">
              {TIMER_PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  type="button"
                  onClick={() => handleStartPreset(p.minutes, p.label)}
                  className="p-3 rounded-xl bg-neutral-950 hover:bg-amber-950/40 border border-neutral-800 hover:border-amber-500/50 text-left transition active:scale-95 group"
                >
                  <div className="text-sm font-black text-white group-hover:text-amber-300 font-mono">
                    {p.minutes}분
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">{p.label}</div>
                </button>
              ))}
            </div>

            {/* Custom Minutes Input */}
            <form onSubmit={handleCustomStart} className="pt-2 border-t border-neutral-800 space-y-2 text-left">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                직접 시간 설정
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="분"
                  className="w-20 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white font-mono text-center outline-none"
                />
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="기도 제목 / 라벨"
                  className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold p-2.5 rounded-xl transition shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
