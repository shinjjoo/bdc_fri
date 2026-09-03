import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, Member } from '../types';
import { ROLE_INFOS } from '../data/presets';
import { IconRenderer } from './IconRenderer';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  Volume2,
  Bell,
  Trash2,
  Users,
  CheckCircle2,
  Mic,
  Music,
  Radio,
} from 'lucide-react';

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  myMemberId: string;
  myRole: UserRole;
  myName: string;
  isLeader: boolean;
  members: Member[];
  onSendMessage: (text: string, targetRole?: UserRole | 'ALL', isNotice?: boolean) => void;
  onClearMessages: () => void;
}

const QUICK_CHAT_TEMPLATES: { category: string; icon: string; items: string[] }[] = [
  {
    category: '송폼 & 진행',
    icon: 'Music',
    items: [
      '다음 곡으로 바로 넘어갑니다 ⏩',
      '후렴 2번 반복 후 끝냅니다 🔁',
      '브릿지 구간 한 번 더! 🎶',
      '템포 조금만 천천히 갈게요 ⏱️',
      '아카펠라로 무반주 찬양 🎙️',
      'C키로 조용히 건반 연결해주세요 🎹',
    ],
  },
  {
    category: '음향 & 모니터',
    icon: 'Volume2',
    items: [
      '보컬 마이크 볼륨 키워주세요 🔊',
      '모니터에 건반 소리 키워주세요 🎹',
      '모니터에 드럼 소리 줄여주세요 🥁',
      '마이크 하울링 체크 부탁드립니다 ⚠️',
      '마이크 배터리 교체 필요합니다 🔋',
    ],
  },
  {
    category: '기도회 & 멘트',
    icon: 'Sparkles',
    items: [
      '기도 멘트 후 바로 찬양 시작 🕊️',
      '자유롭게 통성기도 이어갑니다 🙏',
      '반주 잔잔하게 배경음 유지 🎼',
      '찬양팀 준비 완료되었습니다 👍',
      '아멘! 은혜 가득한 시간입니다 ✨',
    ],
  },
];

const TARGET_ROLE_OPTIONS: { role: UserRole | 'ALL'; label: string }[] = [
  { role: 'ALL', label: '전체 수신' },
  { role: 'LEADER', label: '인도자' },
  { role: 'BROADCAST', label: '음향/방송실' },
  { role: 'PIANO', label: '메인건반' },
  { role: 'SYNTH', label: '세컨건반' },
  { role: 'VOCAL', label: '싱어팀' },
  { role: 'DRUM', label: '드럼' },
  { role: 'BASS', label: '베이스' },
  { role: 'ACOUSTIC', label: '어쿠스틱' },
  { role: 'ELECTRIC', label: '일렉기타' },
];

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  myMemberId,
  myRole,
  myName,
  isLeader,
  members,
  onSendMessage,
  onClearMessages,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<UserRole | 'ALL'>('ALL');
  const [isNotice, setIsNotice] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<number>(0);
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom on new message or when opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), selectedTarget, isNotice);
    setInputText('');
    setIsNotice(false);
  };

  const handleSendQuick = (text: string) => {
    onSendMessage(text, selectedTarget, isNotice);
    setShowQuickTemplates(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-950 border-l border-neutral-800 text-neutral-100 flex flex-col h-full shadow-2xl">
        {/* 1. Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-none">
                  실시간 팀 메시지
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  실시간 전송
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                인도자 ↔ 찬양팀 ↔ 방송실 실시간 소통
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isLeader && messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('모든 채팅 메시지를 삭제하시겠습니까?')) {
                    onClearMessages();
                  }
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 text-xs transition"
                title="채팅 내역 비우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Target Selector Pills Bar */}
        <div className="px-3.5 py-2 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] text-neutral-400 font-semibold shrink-0">수신 대상:</span>
          {TARGET_ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.role}
              type="button"
              onClick={() => setSelectedTarget(opt.role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedTarget === opt.role
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 3. Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-3">
              <div className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-400">
                <MessageSquare className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-300">주고받은 메시지가 없습니다</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  연주 중 필요한 음향 조절, 송폼 변경, 기도회 진행 신호를 자유롭게 주고받으세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickTemplates(true)}
                className="mt-2 text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                빠른 찬양팀 문구 확인하기
              </button>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === myMemberId || msg.senderName === myName;
              const senderRoleInfo = ROLE_INFOS[msg.senderRole] || {
                label: msg.senderRole,
                icon: 'Users',
                color: 'bg-neutral-800 text-neutral-300 border-neutral-700',
              };

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {/* Sender Info Line */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 px-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-neutral-300">{msg.senderName}</span>
                      <span className="text-[10px] text-neutral-500">
                        ({senderRoleInfo.label})
                      </span>
                      {msg.isLeader && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">
                          인도자
                        </span>
                      )}
                    </div>

                    {msg.targetRole && msg.targetRole !== 'ALL' && (
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-semibold border border-blue-500/30">
                        @{ROLE_INFOS[msg.targetRole]?.label || msg.targetRole}
                      </span>
                    )}

                    <span className="text-[10px] text-neutral-600 font-mono">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm transition ${
                      msg.isNotice
                        ? 'bg-amber-950/80 border-2 border-amber-500/80 text-amber-100 ring-1 ring-amber-500/20'
                        : isMine
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-xs'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-tl-xs'
                    }`}
                  >
                    {msg.isNotice && (
                      <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1">
                        <Bell className="w-3.5 h-3.5 animate-bounce" />
                        <span>중요 공지 / 알림</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Canned Templates Accordion / Modal */}
        {showQuickTemplates && (
          <div className="border-t border-neutral-800 bg-neutral-900 p-3 space-y-2.5 max-h-56 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                찬양팀 전용 원터치 빠른 메시지
              </span>
              <button
                type="button"
                onClick={() => setShowQuickTemplates(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                닫기
              </button>
            </div>

            {/* Template Category Tabs */}
            <div className="flex items-center gap-1">
              {QUICK_CHAT_TEMPLATES.map((cat, idx) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveTemplateTab(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTemplateTab === idx
                      ? 'bg-neutral-800 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {QUICK_CHAT_TEMPLATES[activeTemplateTab].items.map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => handleSendQuick(tmpl)}
                  className="text-left text-xs bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 p-2 rounded-xl text-neutral-200 transition truncate active:scale-[0.98]"
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Input Area */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/90 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowQuickTemplates(!showQuickTemplates)}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>원터치 빠른 문구</span>
            </button>

            {isLeader && (
              <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNotice}
                  onChange={(e) => setIsNotice(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                  <Bell className="w-3 h-3" />
                  긴급 공지로 발송
                </span>
              </label>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedTarget === 'ALL'
                  ? '전체 팀원에게 실시간 메시지 전송...'
                  : `@${ROLE_INFOS[selectedTarget]?.label || selectedTarget}에게 메시지...`
              }
              className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold transition shrink-0 shadow-md shadow-amber-500/10"
              title="메시지 전송 (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
