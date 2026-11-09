import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookMarked,
  ArrowRight,
  ScrollText,
  X,
} from 'lucide-react';
import { ARTIFACTS } from '../data/gameData';
import { QuizQuestion, VoiceTone } from '../types/game';

interface QuizStageProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  tone: VoiceTone;
  foundArtifactIds: string[];
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  question,
  questionIndex,
  totalQuestions,
  score,
  foundArtifactIds,
  selectedOption,
  onSelectOption,
  onNext,
}) => {
  const [hintOpen, setHintOpen] = useState(false);

  const matchingArtifact = ARTIFACTS.find(
    (a) => a.hintForQuestionId === question.id && foundArtifactIds.includes(a.id)
  );

  const isAnswered = selectedOption !== null;
  const isLast = questionIndex === totalQuestions - 1;
  const progressPct = ((questionIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100;

  useEffect(() => {
    setHintOpen(false);
  }, [question.id]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 relative">
      {/* Compact Progress + Optional Relic Hint */}
      <div className="shrink-0 rounded-xl border border-[#d4af37]/25 bg-[#0e1915]/90 px-3 py-2">
        <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
          <span className="font-semibold text-[#e8c667] flex items-center gap-1.5 truncate">
            <ScrollText className="w-3.5 h-3.5 shrink-0" />
            <span>
              Вопрос {questionIndex + 1}/{totalQuestions} • {question.topic}
            </span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {matchingArtifact && !isAnswered && (
              <button
                type="button"
                onClick={() => setHintOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#193b2a] border border-[#6ee7a8]/45 text-[#9ff0c1] text-[10px] font-semibold cursor-pointer hover:brightness-110"
              >
                <Lightbulb className="w-3 h-3 text-[#f3d67d]" />
                <span>Подсказка</span>
              </button>
            )}
            <span className="text-[#b8cbbd]">
              Баллы: <strong className="text-[#9ff0c1]">{score}</strong>
            </span>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#1a2b24] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#b88921] to-[#f1d687] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Floating Hint Overlay (does not shift layout) */}
      {hintOpen && matchingArtifact && !isAnswered && (
        <div className="shrink-0 rounded-xl border border-[#7ce8ae]/50 bg-[#112a1e]/95 px-3 py-2 flex items-start justify-between gap-2 shadow-lg">
          <div className="flex items-start gap-2 text-[11px] text-[#dcf8e8] leading-snug">
            <Lightbulb className="w-4 h-4 text-[#f3d67d] shrink-0 mt-0.5" />
            <span>
              <strong>{matchingArtifact.shortTag}:</strong> {matchingArtifact.hintText}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setHintOpen(false)}
            className="text-[#9ff0c1] hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Answer Options evenly sharing middle space */}
      <div className="flex-1 min-h-0 grid grid-rows-4 gap-1.5">
        {question.options.map((option, idx) => {
          const isChosen = selectedOption === idx;
          const isCorrectOption = idx === question.correctIndex;

          let cardClass =
            'bg-[#111d18]/90 border-[#d4af37]/25 hover:border-[#e8c667]/60 hover:bg-[#182922] text-[#f4ede0]';

          if (isAnswered) {
            if (isCorrectOption) {
              cardClass =
                'bg-[#163827] border-[#6ee7a8] text-[#e9fff2] shadow-[0_0_14px_rgba(110,231,168,0.2)]';
            } else if (isChosen && !isCorrectOption) {
              cardClass = 'bg-[#3b1b1d] border-[#ef7b7b] text-[#ffe5e5]';
            } else {
              cardClass =
                'bg-[#0d1612]/60 border-[#d4af37]/10 text-[#86978e] opacity-65';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(idx)}
              className={`w-full h-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-xl border text-left transition-all ${cardClass} ${
                !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                    isAnswered && isCorrectOption
                      ? 'bg-[#6ee7a8] text-[#0c2116] border-[#6ee7a8]'
                      : isAnswered && isChosen && !isCorrectOption
                      ? 'bg-[#ef7b7b] text-[#2a0c0e] border-[#ef7b7b]'
                      : 'bg-[#09110e] text-[#e8c667] border-[#d4af37]/35'
                  }`}
                >
                  {String.fromCharCode(1040 + idx)}
                </span>
                <span className="text-[12.5px] sm:text-[13.5px] font-medium leading-tight line-clamp-2">
                  {option}
                </span>
              </div>

              {isAnswered && isCorrectOption && (
                <CheckCircle2 className="w-4 h-4 text-[#6ee7a8] shrink-0" />
              )}
              {isAnswered && isChosen && !isCorrectOption && (
                <XCircle className="w-4 h-4 text-[#ef7b7b] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Source or Feedback + Next */}
      <div className="shrink-0">
        {!isAnswered ? (
          <div className="rounded-xl border border-[#d4af37]/15 bg-[#0c1612]/85 px-3 py-2 text-[11px] text-[#9fb3a8] flex items-center justify-between">
            <span>Выберите верный вариант ответа</span>
            <span className="truncate ml-2 text-[#cbb98a]">{question.sourceDoc}</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="rounded-xl border border-[#d4af37]/30 bg-[#121f1a]/95 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#e8c667] mb-0.5">
                <BookMarked className="w-3 h-3" />
                <span>Историческая справка</span>
              </div>
              <p className="text-[11px] leading-snug text-[#d7e0da] line-clamp-2">
                {question.historicalNote}
              </p>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#b7861c] via-[#e4c161] to-[#c49222] text-[#11140d] font-semibold text-[13px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(212,175,55,0.35)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>
                {isLast ? 'Услышать вердикт Екатерины II' : 'Следующий вопрос'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
