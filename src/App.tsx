import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  Crown,
  Feather,
  Compass,
} from 'lucide-react';
import timeMachineImg from './assets/time-machine-seal.png';
import {
  CATHERINE_INTRO,
  LOCATIONS,
  QUEST_INSTRUCTION,
  QUIZ_QUESTIONS,
  VERDICT_EXTENDED,
} from './data/gameData';
import { VoiceClipId } from './data/voiceAudio';
import { Artifact, DualText, GamePhase, VoiceTone } from './types/game';
import { audioEngine } from './utils/audioEngine';
import { VoiceDialogueBox } from './components/VoiceDialogueBox';
import { LocationQuest } from './components/LocationQuest';
import { QuizStage } from './components/QuizStage';
import { VerdictScreen } from './components/VerdictScreen';
import { InfoModal } from './components/InfoModal';

const PASS_THRESHOLD = 5;
const STORAGE_KEY = 'favorite_history_save_v1';

interface DialogueState {
  clipId: VoiceClipId;
  text: DualText;
  sourceLabel: string;
}

export function App() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [tone, setTone] = useState<VoiceTone>('official');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const [foundArtifactIds, setFoundArtifactIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.foundArtifactIds)) {
          return parsed.foundArtifactIds;
        }
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [bestRank, setBestRank] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).bestRank ?? null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const [dialogue, setDialogue] = useState<DialogueState>({
    clipId: 'intro',
    text: CATHERINE_INTRO,
    sourceLabel: 'ИИ-голос с немецким акцентом',
  });

  const warpTimerRef = useRef<number | null>(null);

  useEffect(() => {
    audioEngine.setSpeakingListener(setIsSpeaking);
    return () => {
      audioEngine.stopSpeech();
      if (warpTimerRef.current !== null) {
        window.clearTimeout(warpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ foundArtifactIds, bestRank })
      );
    } catch {
      // ignore
    }
  }, [foundArtifactIds, bestRank]);

  const speakDialogue = (nextDialogue: DialogueState, activeTone: VoiceTone) => {
    setDialogue(nextDialogue);
    audioEngine.playClip(
      nextDialogue.clipId,
      activeTone,
      nextDialogue.text[activeTone]
    );
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const handleToneChange = (nextTone: VoiceTone) => {
    if (nextTone === tone) return;
    setTone(nextTone);
    audioEngine.playToneSwitchSound();
    if (phase === 'intro') {
      if (isSpeaking) {
        audioEngine.playClip('intro', nextTone, CATHERINE_INTRO[nextTone]);
      }
    } else if (phase !== 'timewarp') {
      audioEngine.playClip(dialogue.clipId, nextTone, dialogue.text[nextTone]);
    }
  };

  const handleReplayDialogue = () => {
    audioEngine.playClip(dialogue.clipId, tone, dialogue.text[tone]);
  };

  const handlePreviewIntroVoice = () => {
    if (isSpeaking) {
      audioEngine.stopSpeech();
    } else {
      audioEngine.playClip('intro', tone, CATHERINE_INTRO[tone]);
    }
  };

  const handleStartTimeMachine = () => {
    audioEngine.stopSpeech();
    audioEngine.playTimeWarpSound();
    setPhase('timewarp');

    warpTimerRef.current = window.setTimeout(() => {
      setPhase('quest');
      speakDialogue(
        {
          clipId: 'quest_intro',
          text: QUEST_INSTRUCTION,
          sourceLabel:
            tone === 'official'
              ? 'Именной указ • Зимний дворец'
              : 'Утренняя беседа • Вольтер',
        },
        tone
      );
    }, 1750);
  };

  const handleSwitchLocation = (locId: 'study' | 'gallery') => {
    const loc = LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;
    speakDialogue(
      {
        clipId: loc.clipId,
        text: loc.introComment,
        sourceLabel: loc.name,
      },
      tone
    );
  };

  const handleDiscoverArtifact = (artifact: Artifact) => {
    audioEngine.playArtifactFoundSound();
    setFoundArtifactIds((prev) =>
      prev.includes(artifact.id) ? prev : [...prev, artifact.id]
    );
    speakDialogue(
      {
        clipId: artifact.clipId,
        text: artifact.catherineComment,
        sourceLabel: artifact.archiveSource,
      },
      tone
    );
  };

  const handleInspectArtifact = (artifact: Artifact) => {
    speakDialogue(
      {
        clipId: artifact.clipId,
        text: artifact.catherineComment,
        sourceLabel: artifact.archiveSource,
      },
      tone
    );
  };

  const handleStartQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setPhase('quiz');

    const firstQ = QUIZ_QUESTIONS[0];
    speakDialogue(
      {
        clipId: firstQ.promptClipId,
        text: firstQ.prompt,
        sourceLabel: firstQ.sourceDoc,
      },
      tone
    );
  };

  const handleSelectQuizOption = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const currentQ = QUIZ_QUESTIONS[questionIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    audioEngine.playAnswerSound(isCorrect);
    speakDialogue(
      {
        clipId: isCorrect ? currentQ.correctClipId : currentQ.wrongClipId,
        text: isCorrect ? currentQ.reactionCorrect : currentQ.reactionWrong,
        sourceLabel: currentQ.sourceDoc,
      },
      tone
    );
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < QUIZ_QUESTIONS.length) {
      const nextIdx = questionIndex + 1;
      setQuestionIndex(nextIdx);
      setSelectedOption(null);

      const nextQ = QUIZ_QUESTIONS[nextIdx];
      speakDialogue(
        {
          clipId: nextQ.promptClipId,
          text: nextQ.prompt,
          sourceLabel: nextQ.sourceDoc,
        },
        tone
      );
    } else {
      const passed = score >= PASS_THRESHOLD;
      setPhase('verdict');
      audioEngine.playVerdictSound(passed);

      if (passed) {
        setBestRank('Статс-секретарь Е.И.В.');
      }

      speakDialogue(
        {
          clipId: passed ? 'verdict_pass' : 'verdict_fail',
          text: passed ? VERDICT_EXTENDED.pass : VERDICT_EXTENDED.fail,
          sourceLabel: passed
            ? 'Высочайший Указ'
            : 'Из «Записок» о Таците',
        },
        tone
      );
    }
  };

  const handleBackToPalace = () => {
    setPhase('quest');
    speakDialogue(
      {
        clipId: 'quest_intro',
        text: QUEST_INSTRUCTION,
        sourceLabel: 'Покои Зимнего дворца',
      },
      tone
    );
  };

  const handleFullReset = () => {
    audioEngine.stopSpeech();
    setFoundArtifactIds([]);
    setScore(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setPhase('intro');
    setDialogue({
      clipId: 'intro',
      text: CATHERINE_INTRO,
      sourceLabel: 'ИИ-голос с немецким акцентом',
    });
  };

  const phaseBadgeText: Record<GamePhase, string> = {
    intro: 'Машина времени',
    timewarp: 'Перенос • 1775 г.',
    quest: 'Зимний дворец',
    quiz: 'Аудиенция',
    verdict: 'Вердикт',
  };

  return (
    <div className="h-dvh w-full bg-[#070c0a] flex justify-center overflow-hidden relative">
      {/* Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#d4af37]/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[450px] h-[340px] rounded-full bg-[#1d543c]/15 blur-[110px]" />
      </div>

      {/* Single-Screen Mobile Frame (h-dvh, zero vertical scroll) */}
      <div className="relative w-full max-w-[460px] h-dvh flex flex-col overflow-hidden bg-gradient-to-b from-[#0d1713] via-[#0b1310] to-[#080e0b] border-x border-[#d4af37]/15 shadow-[0_0_60px_rgba(0,0,0,0.85)]">
        {/* Compact Header */}
        <header className="shrink-0 h-12 flex items-center justify-between px-3.5 bg-[#0b1310]/95 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c99b2e] to-[#7d5a12] flex items-center justify-center text-[#0b110d] shadow-sm shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="font-imperial text-[15px] font-bold leading-none text-[#f6e19c] truncate">
                Фаворит истории
              </h1>
              <span className="text-[10px] text-[#9eb3a7] tracking-wide block mt-0.5">
                {phaseBadgeText[phase]} • 1775 г.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {phase !== 'intro' && phase !== 'timewarp' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#15241e] border border-[#d4af37]/25 text-[10px] font-medium text-[#e8c667]">
                <Compass className="w-3 h-3" />
                {foundArtifactIds.length}/6
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-[#361c1c]/80 border-[#e07a7a]/35 text-[#f4b3b3]'
                  : 'bg-[#14221c] hover:bg-[#1c2f27] border-[#d4af37]/25 text-[#e8c667]'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              aria-label="О проекте и источниках"
              className="p-1.5 rounded-lg bg-[#14221c] hover:bg-[#1c2f27] border border-[#d4af37]/25 text-[#d7cab0] transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Single-Screen Stage Container (Zero Scroll) */}
        <main className="flex-1 min-h-0 flex flex-col px-3 py-2.5 gap-2 overflow-hidden">
          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <div className="flex-1 min-h-0 flex flex-col gap-2">
              {/* Flexible Hero Image Card */}
              <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-[#0d1612] shadow-xl">
                <img
                  src={timeMachineImg}
                  alt="Хронометр машины времени XVIII века"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09110e] via-[#09110e]/45 to-transparent" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 border border-[#d4af37]/40 backdrop-blur-sm text-[10px] font-semibold text-[#f3d67d]">
                    <Clock className="w-3 h-3" />
                    <span>2026 → 1775 • Зимний дворец</span>
                  </span>
                  {bestRank && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#163827]/90 border border-[#6ee7a8]/45 text-[10px] font-semibold text-[#a5f7cb]">
                      <Sparkles className="w-3 h-3" />
                      <span>Статс-секретарь</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 inset-x-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8c667]">
                    Голосовая ИИ-викторина
                  </div>
                  <h2 className="mt-0.5 font-imperial text-2xl sm:text-3xl font-bold text-[#fff5dc] leading-none">
                    Аудиенция у Екатерины II
                  </h2>
                  <p className="mt-1.5 text-[11.5px] sm:text-xs leading-snug text-[#dce5df] line-clamp-2">
                    Отыщите реликвии в покоях и пройдите испытание Императрицы (лёгкий немецкий акцент, 2 тона речи).
                  </p>
                </div>
              </div>

              {/* Compact Voice Tone Selector + Listen Sample */}
              <div className="shrink-0 rounded-2xl border border-[#d4af37]/30 bg-[#101c17]/90 p-2.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#f1d687]">
                    Тон голоса Императрицы:
                  </span>
                  <button
                    type="button"
                    onClick={handlePreviewIntroVoice}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b3127] hover:bg-[#244235] border border-[#d4af37]/35 text-[10.5px] font-medium text-[#f5df98] cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isSpeaking ? 'Остановить' : 'Послушать голос'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToneChange('official')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      tone === 'official'
                        ? 'bg-[#213328] border-[#e8c667] text-[#fff6df] shadow-sm'
                        : 'bg-[#0b1310] border-[#d4af37]/20 text-[#aebcb4]'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11.5px] font-semibold text-[#f1d687]">
                      <Crown className="w-3 h-3" />
                      <span>Официальный</span>
                    </div>
                    <p className="mt-0.5 text-[10px] leading-tight opacity-85 truncate">
                      Слог указов и манифестов
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneChange('voltaire')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      tone === 'voltaire'
                        ? 'bg-[#213328] border-[#e8c667] text-[#fff6df] shadow-sm'
                        : 'bg-[#0b1310] border-[#d4af37]/20 text-[#aebcb4]'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11.5px] font-semibold text-[#f1d687]">
                      <Feather className="w-3 h-3" />
                      <span>С Вольтером</span>
                    </div>
                    <p className="mt-0.5 text-[10px] leading-tight opacity-85 truncate">
                      Домашний тон переписки
                    </p>
                  </button>
                </div>
              </div>

              {/* Start CTA */}
              <button
                type="button"
                onClick={handleStartTimeMachine}
                className="shrink-0 w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#b7861c] via-[#e4c161] to-[#c49222] text-[#11140d] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Запустить машину времени</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TIMEWARP TRANSITION */}
          {phase === 'timewarp' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#d4af37] via-[#fff2ba] to-[#876214] shadow-[0_0_50px_rgba(232,198,103,0.45)] animate-float-slow">
                <img
                  src={timeMachineImg}
                  alt="Перенос во времени"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                Хроно-синхронизация
              </div>
              <h2 className="mt-1.5 font-imperial text-3xl font-bold gold-shimmer">
                2026 → 1775
              </h2>
              <p className="mt-2 text-xs text-[#b8cbbd] max-w-xs leading-relaxed">
                Открываются двери покоев Зимнего дворца. Екатерина Алексеевна откладывает перо и поворачивается к вам…
              </p>
            </div>
          )}

          {/* ACTIVE GAME PHASES (QUEST, QUIZ, VERDICT) */}
          {(phase === 'quest' || phase === 'quiz' || phase === 'verdict') && (
            <>
              <VoiceDialogueBox
                text={dialogue.text[tone]}
                tone={tone}
                onToneChange={handleToneChange}
                isSpeaking={isSpeaking}
                isMuted={isMuted}
                onReplay={handleReplayDialogue}
                onStop={() => audioEngine.stopSpeech()}
                sourceLabel={dialogue.sourceLabel}
              />

              {phase === 'quest' && (
                <LocationQuest
                  foundIds={foundArtifactIds}
                  onDiscoverArtifact={handleDiscoverArtifact}
                  onInspectArtifact={handleInspectArtifact}
                  onFinishQuest={handleStartQuiz}
                  onSwitchLocation={handleSwitchLocation}
                />
              )}

              {phase === 'quiz' && (
                <QuizStage
                  question={QUIZ_QUESTIONS[questionIndex]}
                  questionIndex={questionIndex}
                  totalQuestions={QUIZ_QUESTIONS.length}
                  score={score}
                  tone={tone}
                  foundArtifactIds={foundArtifactIds}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectQuizOption}
                  onNext={handleNextQuestion}
                />
              )}

              {phase === 'verdict' && (
                <VerdictScreen
                  score={score}
                  passed={score >= PASS_THRESHOLD}
                  foundArtifactIds={foundArtifactIds}
                  onRestartQuiz={handleStartQuiz}
                  onBackToPalace={handleBackToPalace}
                  onFullReset={handleFullReset}
                />
              )}
            </>
          )}
        </main>
      </div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

export default App;
