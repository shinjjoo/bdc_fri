import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, Smartphone, Radio } from 'lucide-react';

interface ShareRoomModalProps {
  isOpen: boolean;
  roomId: string;
  roomName: string;
  onClose: () => void;
}

export const ShareRoomModal: React.FC<ShareRoomModalProps> = ({
  isOpen,
  roomId,
  roomName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}?room=${encodeURIComponent(roomId)}` : '';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 sm:p-6 text-center space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">찬양팀 초대 및 QR 연결</h3>
              <p className="text-[11px] text-neutral-400">카메라로 스캔하면 즉시 접속</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room ID Display */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">방 이름 / 코드</span>
            <span className="text-base font-extrabold text-amber-300">{roomId}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-400 bg-neutral-900 px-2 py-1 rounded-lg">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>실시간 동기화</span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl w-fit mx-auto shadow-xl">
          <QRCodeSVG
            value={currentUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#0a0a0a"
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-xs text-neutral-400">
          찬양팀원들의 스마트폰 카메라로 QR 코드를 스캔하거나 아래 링크를 복사하여 카카오톡에 공유하세요.
        </p>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs border border-neutral-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">초대 링크가 복사되었습니다!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-400" />
              <span>초대 링크 복사하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
