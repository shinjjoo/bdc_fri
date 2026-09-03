import React, { useState } from 'react';
import { CueCategory, QuickPreset } from '../types';
import { IconRenderer } from './IconRenderer';
import { X, Sparkles } from 'lucide-react';

interface CustomPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPreset: (preset: QuickPreset) => void;
}

const AVAILABLE_ICONS = [
  'Repeat',
  'Music2',
  'Flame',
  'Activity',
  'Sparkles',
  'BellRing',
  'Volume1',
  'VolumeX',
  'HeartHandshake',
  'Hourglass',
  'TrendingUp',
  'OctagonAlert',
  'GitCommit',
  'CornerUpLeft',
  'ArrowRight',
  'CheckCircle2',
];

const COLOR_OPTIONS: QuickPreset['color'][] = [
  'amber',
  'emerald',
  'blue',
  'rose',
  'purple',
  'cyan',
  'orange',
  'red',
];

export const CustomPresetModal: React.FC<CustomPresetModalProps> = ({
  isOpen,
  onClose,
  onAddPreset,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CueCategory>('SONG_FLOW');
  const [color, setColor] = useState<QuickPreset['color']>('amber');
  const [icon, setIcon] = useState('Sparkles');
  const [urgency, setUrgency] = useState<QuickPreset['urgency']>('NORMAL');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPreset: QuickPreset = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      color,
      icon,
      urgency,
      defaultNote: note.trim() || undefined,
    };

    onAddPreset(newPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">커스텀 신호 버튼 추가</h3>
              <p className="text-xs text-neutral-400">우리 교회 맞춤 신호 프리셋</p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-neutral-300 font-bold block mb-1">신호 명칭 (버튼 이름) *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 자유기도 BGM, 불 끄기, 코러스 3회"
              required
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">영문 / 서브 설명</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: Free Prayer BGM, Lights Off"
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CueCategory)}
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            >
              <option value="SONG_FLOW">곡 진행 (Song Flow)</option>
              <option value="DYNAMICS">다이내믹 / 악기 (Dynamics)</option>
              <option value="PRAYER">기도회 진행 (Prayer Flow)</option>
              <option value="CUSTOM">기타 커스텀 (Custom)</option>
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-neutral-300 font-bold block mb-1.5">버튼 테마 색상</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                  } ${
                    c === 'amber'
                      ? 'bg-amber-500'
                      : c === 'emerald'
                      ? 'bg-emerald-500'
                      : c === 'blue'
                      ? 'bg-blue-500'
                      : c === 'rose'
                      ? 'bg-rose-500'
                      : c === 'purple'
                      ? 'bg-purple-500'
                      : c === 'cyan'
                      ? 'bg-cyan-500'
                      : c === 'orange'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-neutral-300 font-bold block mb-1.5">아이콘 선택</label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-xl border flex items-center justify-center transition ${
                    icon === ic
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <IconRenderer name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-neutral-300 font-bold block mb-1">기본 안내 팁 메모</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 2절 끝난 후 바로 진입"
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl transition text-sm shadow-md"
            >
              신호 프리셋 등록
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-xl text-sm transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
