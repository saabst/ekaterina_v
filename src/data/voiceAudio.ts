import { VoiceTone } from '../types/game';

/**
 * Идентификаторы всех предзаписанных реплик Екатерины II.
 * Озвучка генерируется скриптом scripts/generate_voices.py и лежит в public/audio/.
 */
export type VoiceClipId =
  | 'intro'
  | 'quest_intro'
  | 'loc_study'
  | 'loc_gallery'
  | 'art_potemkin-portrait'
  | 'art_nobility-decree'
  | 'art_voltaire-letter'
  | 'art_nakaz-book'
  | 'art_chesma-medal'
  | 'art_tacitus-volume'
  | 'q1_prompt'
  | 'q1_correct'
  | 'q1_wrong'
  | 'q2_prompt'
  | 'q2_correct'
  | 'q2_wrong'
  | 'q3_prompt'
  | 'q3_correct'
  | 'q3_wrong'
  | 'q4_prompt'
  | 'q4_correct'
  | 'q4_wrong'
  | 'q5_prompt'
  | 'q5_correct'
  | 'q5_wrong'
  | 'q6_prompt'
  | 'q6_correct'
  | 'q6_wrong'
  | 'q7_prompt'
  | 'q7_correct'
  | 'q7_wrong'
  | 'verdict_pass'
  | 'verdict_fail';

/**
 * Возвращает URL MP3-файла относительно текущей страницы.
 *
 * Путь не начинается со слэша, поэтому работает одинаково:
 *  - на корне домена (http://localhost:5173/, https://example.com/);
 *  - в подпапке GitHub Pages (https://user.github.io/repo-name/).
 */
export function getClipUrl(clipId: VoiceClipId, tone: VoiceTone): string {
  const relativePath = `audio/${clipId}_${tone}.mp3`;
  if (typeof document === 'undefined') {
    return relativePath;
  }
  return new URL(relativePath, document.baseURI).href;
}
