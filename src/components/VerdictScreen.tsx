import React from 'react';
import {
  Crown,
  BookOpen,
  RotateCcw,
  Award,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import {
  ARTIFACTS,
  QUIZ_QUESTIONS,
  VERDICT_FAIL_PHRASE,
  VERDICT_PASS_PHRASE,
} from '../data/gameData';

interface VerdictScreenProps {
  score: number;
  passed: boolean;
  foundArtifactIds: string[];
  onRestartQuiz: () => void;
  onBackToPalace: () => void;
  onFullReset: () => void;
}

export const VerdictScreen: React.FC<VerdictScreenProps> = ({
  score,
  passed,
  foundArtifactIds,
  onRestartQuiz,
  onBackToPalace,
  onFullReset,
}) => {
  const totalQuestions = QUIZ_QUESTIONS.length;
  const accuracy = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2">
      {/* Main Verdict Card */}
      <div
        className={`flex-1 min-h-0 flex flex-col justify-between rounded-2xl border p-3.5 text-center overflow-hidden shadow-xl ${
          passed
            ? 'border-[#e8c667]/60 bg-gradient-to-b from-[#213327] via-[#13211a] to-[#0c1611]'
            : 'border-[#c97e6e]/45 bg-gradient-to-b from-[#2d1d1c] via-[#1b1413] to-[#110d0c]'
        }`}
      >
        <div>
          <div className="mx-auto mb-2 w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-md bg-[#0c1410] border-[#d4af37]">
            {passed ? (
              <Crown className="w-5 h-5 text-[#f2d478]" />
            ) : (
              <BookOpen className="w-5 h-5 text-[#e49d8d]" />
            )}
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            {passed ? 'Высочайший Указ о назначении' : 'Резолюция Её Величества'}
          </div>

          <h2 className="mt-1 font-imperial text-xl sm:text-2xl font-bold text-[#fff5dc] leading-tight">
            {passed ? VERDICT_PASS_PHRASE : VERDICT_FAIL_PHRASE}
          </h2>

          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/35 border border-[#d4af37]/30 text-[10.5px] text-[#e5d5a7]">
            <Award className="w-3 h-3 text-[#e8c667]" />
            <span>
              {passed
                ? 'Чин: Статс-секретарь Е.И.В.'
                : 'Рекомендуется чтение «Анналов» Тацита'}
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2 text-center my-2">
          <div className="rounded-xl bg-black/30 border border-white/10 py-1.5 px-1">
            <div className="text-base font-bold text-[#f3d67d] leading-tight">
              {score}/{totalQuestions}
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-[#aab9b0]">
              Ответы
            </div>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 py-1.5 px-1">
            <div className="text-base font-bold text-[#f3d67d] leading-tight">
              {accuracy}%
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-[#aab9b0]">
              Точность
            </div>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 py-1.5 px-1">
            <div className="text-base font-bold text-[#9ff0c1] leading-tight">
              {foundArtifactIds.length}/{ARTIFACTS.length}
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-[#aab9b0]">
              Реликвии
            </div>
          </div>
        </div>

        {/* Compact 2x3 Collected Relics Grid */}
        <div className="text-left">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
            Реликвии Зимнего дворца
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {ARTIFACTS.map((art) => {
              const found = foundArtifactIds.includes(art.id);
              return (
                <div
                  key={art.id}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-[10.5px] ${
                    found
                      ? 'bg-[#173225]/75 border-[#6ee7a8]/35 text-[#e7f8ef]'
                      : 'bg-[#0a120f]/60 border-white/5 text-[#75857d]'
                  }`}
                >
                  <span className="truncate font-medium">{art.shortTag}</span>
                  {found ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6ee7a8] shrink-0 ml-1" />
                  ) : (
                    <span className="text-[9px] shrink-0 ml-1 opacity-70">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="shrink-0 space-y-1.5">
        <button
          type="button"
          onClick={onRestartQuiz}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#b7861c] via-[#e4c161] to-[#c49222] text-[#11140d] font-semibold text-[13px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:brightness-105 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{passed ? 'Пройти экзамен ещё раз' : 'Пересдать экзамен'}</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onBackToPalace}
            className="py-2 px-3 rounded-xl bg-[#162620] hover:bg-[#1f342c] border border-[#d4af37]/30 text-[#f0d990] font-medium text-[11.5px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>В покои дворца</span>
          </button>

          <button
            type="button"
            onClick={onFullReset}
            className="py-2 px-3 rounded-xl bg-[#101a16] hover:bg-[#182621] border border-white/10 text-[#b2c2b9] font-medium text-[11.5px] transition-colors cursor-pointer"
          >
            Машина времени
          </button>
        </div>
      </div>
    </div>
  );
};
