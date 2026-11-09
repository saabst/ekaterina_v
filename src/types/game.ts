import type { VoiceClipId } from '../data/voiceAudio';

export type VoiceTone = 'official' | 'voltaire';

export type GamePhase = 'intro' | 'timewarp' | 'quest' | 'quiz' | 'verdict';

export interface DualText {
  official: string;
  voltaire: string;
}

export interface Artifact {
  id: string;
  clipId: VoiceClipId;
  locationId: 'study' | 'gallery';
  title: string;
  year: string;
  archiveSource: string;
  shortTag: string;
  /** Percentage position on the room illustration (0-100) */
  x: number;
  y: number;
  iconName: 'portrait' | 'scroll' | 'feather' | 'book' | 'medal' | 'crown';
  description: string;
  catherineComment: DualText;
  /** Question ID this artifact provides a subtle hint for */
  hintForQuestionId: string;
  hintText: string;
}

export interface LocationScene {
  id: 'study' | 'gallery';
  clipId: VoiceClipId;
  name: string;
  subtitle: string;
  image: string;
  introComment: DualText;
}

export interface QuizQuestion {
  id: string;
  promptClipId: VoiceClipId;
  correctClipId: VoiceClipId;
  wrongClipId: VoiceClipId;
  topic: string;
  sourceDoc: string;
  prompt: DualText;
  options: string[];
  correctIndex: number;
  reactionCorrect: DualText;
  reactionWrong: DualText;
  historicalNote: string;
}
