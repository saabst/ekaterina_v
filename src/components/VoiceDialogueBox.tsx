import React from 'react';
import { Volume2, Crown, Feather, Square } from 'lucide-react';
import catherineImg from '../assets/catherine-portrait.png';
import { VoiceTone } from '../types/game';

interface VoiceDialogueBoxProps {
  text: string;
  tone: VoiceTone;
  onToneChange: (tone: VoiceTone) => void;
  isSpeaking: boolean;
  isMuted: boolean;
  onReplay: () => void;
  onStop?: () => void;
  sourceLabel?: string;
}

export const VoiceDialogueBox: React.FC<VoiceDialogueBoxProps> = ({
  text,
  tone,
  onToneChange,
  isSpeaking,
  isMuted,
  onReplay,
  onStop,
  sourceLabel,
}) => {
  return (
    <div className="shrink-0 relative rounded-2xl border border-[#d4af37]/35 bg-gradient-to-b from-[#16241e]/95 to-[#0d1713]/95 shadow-[0_10px_28px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#e8c667]/70 to-transparent" />

      {/* Top Tone Switcher & Replay row */}
      <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 border-b border-[#d4af37]/15">
        <div
          className="inline-flex rounded-full bg-[#09110e] p-0.5 border border-[#d4af37]/25"
          role="group"
          aria-label="Тон речи Екатерины II"
        >
          <button
            type="button"
            onClick={() => onToneChange('official')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
              tone === 'official'
                ? 'bg-gradient-to-r from-[#b88921] to-[#dfc065] text-[#111510] shadow-sm'
                : 'text-[#cbbd9e] hover:text-[#f5e7c2]'
            }`}
          >
            <Crown className="w-2.5 h-2.5" />
            <span>Официальный</span>
          </button>
          <button
            type="button"
            onClick={() => onToneChange('voltaire')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
              tone === 'voltaire'
                ? 'bg-gradient-to-r from-[#b88921] to-[#dfc065] text-[#111510] shadow-sm'
                : 'text-[#cbbd9e] hover:text-[#f5e7c2]'
            }`}
          >
            <Feather className="w-2.5 h-2.5" />
            <span>С Вольтером</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {isSpeaking && !isMuted && onStop ? (
            <button
              type="button"
              onClick={onStop}
              title="Остановить речь"
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] text-[#f4c0b8] bg-[#361c1c]/80 hover:bg-[#492525] border border-[#e07a7a]/30 transition-colors cursor-pointer"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Стоп</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReplay}
              title="Озвучить реплику"
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] text-[#e8c667] bg-[#1c2e26]/85 hover:bg-[#273f34] border border-[#d4af37]/25 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>Голос</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Portrait + Text */}
      <div className="flex items-center gap-2.5 px-3 py-2">
        <div className="relative shrink-0">
          <div
            className={`relative rounded-full p-[2px] transition-all duration-300 ${
              isSpeaking && !isMuted
                ? 'bg-gradient-to-tr from-[#e8c667] via-[#fff2ba] to-[#b5871e] shadow-[0_0_16px_rgba(232,198,103,0.55)]'
                : 'bg-[#d4af37]/40'
            }`}
          >
            <img
              src={catherineImg}
              alt="Екатерина II"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover object-top"
            />
          </div>

          <div
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-[2px] px-1.5 py-0.5 rounded-full bg-[#09110e] border border-[#d4af37]/40 ${
              isSpeaking && !isMuted ? 'opacity-100' : 'opacity-45'
            }`}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.14}s` }}
                className={`w-[2px] rounded-full bg-[#e8c667] ${
                  isSpeaking && !isMuted ? 'h-2 voice-bar' : 'h-1'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="font-imperial text-sm font-bold text-[#f1d687] leading-none">
              Екатерина II
            </span>
            {sourceLabel && (
              <span className="text-[9.5px] text-[#9fb3a8] truncate max-w-[180px]">
                {sourceLabel}
              </span>
            )}
          </div>
          <p className="text-[12px] sm:text-[13px] leading-[1.34] text-[#f6efe2] line-clamp-3">
            «{text}»
          </p>
        </div>
      </div>
    </div>
  );
};
