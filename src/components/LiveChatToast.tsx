import React from 'react';
import { ChatMessage } from '../types';
import { ROLE_INFOS } from '../data/presets';
import { IconRenderer } from './IconRenderer';
import { MessageSquare, Bell, ChevronRight, X } from 'lucide-react';

interface LiveChatToastProps {
  message: ChatMessage | null;
  onOpenChat: () => void;
  onDismiss: () => void;
}

export const LiveChatToast: React.FC<LiveChatToastProps> = ({
  message,
  onOpenChat,
  onDismiss,
}) => {
  if (!message) return null;

  const roleInfo = ROLE_INFOS[message.senderRole] || {
    label: message.senderRole,
    icon: 'Users',
    color: 'bg-neutral-800 text-neutral-200',
  };

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
      <div
        onClick={onOpenChat}
        role="button"
        tabIndex={0}
        className={`w-full p-3 rounded-2xl border shadow-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 backdrop-blur-md ${
          message.isNotice
            ? 'bg-amber-950/95 border-amber-500 text-amber-100 ring-2 ring-amber-500/30'
            : 'bg-neutral-900/95 border-neutral-700 text-neutral-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              message.isNotice
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-800 text-amber-400 border border-neutral-700'
            }`}
          >
            {message.isNotice ? (
              <Bell className="w-4 h-4 animate-bounce" />
            ) : (
              <IconRenderer name={roleInfo.icon} className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {message.senderName}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                ({roleInfo.label})
              </span>
              {message.isLeader && (
                <span className="text-[9px] bg-amber-500/30 text-amber-300 font-bold px-1 rounded">
                  인도자
                </span>
              )}
              {message.targetRole && message.targetRole !== 'ALL' && (
                <span className="text-[10px] bg-blue-900 text-blue-300 font-semibold px-1.5 py-0.2 rounded">
                  @{ROLE_INFOS[message.targetRole]?.label || message.targetRole}
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-neutral-200 truncate mt-0.5 max-w-full">
              {message.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center text-xs text-amber-400 font-semibold">
            <span className="hidden sm:inline">채팅 열기</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
