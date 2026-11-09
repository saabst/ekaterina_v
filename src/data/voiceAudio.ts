import { VoiceTone } from '../types/game';

import introOfficial from '../assets/audio/intro_official.mp3';
import introVoltaire from '../assets/audio/intro_voltaire.mp3';
import questIntroOfficial from '../assets/audio/quest_intro_official.mp3';
import questIntroVoltaire from '../assets/audio/quest_intro_voltaire.mp3';
import locStudyOfficial from '../assets/audio/loc_study_official.mp3';
import locStudyVoltaire from '../assets/audio/loc_study_voltaire.mp3';
import locGalleryOfficial from '../assets/audio/loc_gallery_official.mp3';
import locGalleryVoltaire from '../assets/audio/loc_gallery_voltaire.mp3';

import artPotemkinOfficial from '../assets/audio/art_potemkin-portrait_official.mp3';
import artPotemkinVoltaire from '../assets/audio/art_potemkin-portrait_voltaire.mp3';
import artNobilityOfficial from '../assets/audio/art_nobility-decree_official.mp3';
import artNobilityVoltaire from '../assets/audio/art_nobility-decree_voltaire.mp3';
import artVoltaireOfficial from '../assets/audio/art_voltaire-letter_official.mp3';
import artVoltaireVoltaire from '../assets/audio/art_voltaire-letter_voltaire.mp3';
import artNakazOfficial from '../assets/audio/art_nakaz-book_official.mp3';
import artNakazVoltaire from '../assets/audio/art_nakaz-book_voltaire.mp3';
import artChesmaOfficial from '../assets/audio/art_chesma-medal_official.mp3';
import artChesmaVoltaire from '../assets/audio/art_chesma-medal_voltaire.mp3';
import artTacitusOfficial from '../assets/audio/art_tacitus-volume_official.mp3';
import artTacitusVoltaire from '../assets/audio/art_tacitus-volume_voltaire.mp3';

import q1PromptOfficial from '../assets/audio/q1_prompt_official.mp3';
import q1PromptVoltaire from '../assets/audio/q1_prompt_voltaire.mp3';
import q1CorrectOfficial from '../assets/audio/q1_correct_official.mp3';
import q1CorrectVoltaire from '../assets/audio/q1_correct_voltaire.mp3';
import q1WrongOfficial from '../assets/audio/q1_wrong_official.mp3';
import q1WrongVoltaire from '../assets/audio/q1_wrong_voltaire.mp3';

import q2PromptOfficial from '../assets/audio/q2_prompt_official.mp3';
import q2PromptVoltaire from '../assets/audio/q2_prompt_voltaire.mp3';
import q2CorrectOfficial from '../assets/audio/q2_correct_official.mp3';
import q2CorrectVoltaire from '../assets/audio/q2_correct_voltaire.mp3';
import q2WrongOfficial from '../assets/audio/q2_wrong_official.mp3';
import q2WrongVoltaire from '../assets/audio/q2_wrong_voltaire.mp3';

import q3PromptOfficial from '../assets/audio/q3_prompt_official.mp3';
import q3PromptVoltaire from '../assets/audio/q3_prompt_voltaire.mp3';
import q3CorrectOfficial from '../assets/audio/q3_correct_official.mp3';
import q3CorrectVoltaire from '../assets/audio/q3_correct_voltaire.mp3';
import q3WrongOfficial from '../assets/audio/q3_wrong_official.mp3';
import q3WrongVoltaire from '../assets/audio/q3_wrong_voltaire.mp3';

import q4PromptOfficial from '../assets/audio/q4_prompt_official.mp3';
import q4PromptVoltaire from '../assets/audio/q4_prompt_voltaire.mp3';
import q4CorrectOfficial from '../assets/audio/q4_correct_official.mp3';
import q4CorrectVoltaire from '../assets/audio/q4_correct_voltaire.mp3';
import q4WrongOfficial from '../assets/audio/q4_wrong_official.mp3';
import q4WrongVoltaire from '../assets/audio/q4_wrong_voltaire.mp3';

import q5PromptOfficial from '../assets/audio/q5_prompt_official.mp3';
import q5PromptVoltaire from '../assets/audio/q5_prompt_voltaire.mp3';
import q5CorrectOfficial from '../assets/audio/q5_correct_official.mp3';
import q5CorrectVoltaire from '../assets/audio/q5_correct_voltaire.mp3';
import q5WrongOfficial from '../assets/audio/q5_wrong_official.mp3';
import q5WrongVoltaire from '../assets/audio/q5_wrong_voltaire.mp3';

import q6PromptOfficial from '../assets/audio/q6_prompt_official.mp3';
import q6PromptVoltaire from '../assets/audio/q6_prompt_voltaire.mp3';
import q6CorrectOfficial from '../assets/audio/q6_correct_official.mp3';
import q6CorrectVoltaire from '../assets/audio/q6_correct_voltaire.mp3';
import q6WrongOfficial from '../assets/audio/q6_wrong_official.mp3';
import q6WrongVoltaire from '../assets/audio/q6_wrong_voltaire.mp3';

import q7PromptOfficial from '../assets/audio/q7_prompt_official.mp3';
import q7PromptVoltaire from '../assets/audio/q7_prompt_voltaire.mp3';
import q7CorrectOfficial from '../assets/audio/q7_correct_official.mp3';
import q7CorrectVoltaire from '../assets/audio/q7_correct_voltaire.mp3';
import q7WrongOfficial from '../assets/audio/q7_wrong_official.mp3';
import q7WrongVoltaire from '../assets/audio/q7_wrong_voltaire.mp3';

import verdictPassOfficial from '../assets/audio/verdict_pass_official.mp3';
import verdictPassVoltaire from '../assets/audio/verdict_pass_voltaire.mp3';
import verdictFailOfficial from '../assets/audio/verdict_fail_official.mp3';
import verdictFailVoltaire from '../assets/audio/verdict_fail_voltaire.mp3';

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

export const VOICE_CLIPS: Record<VoiceClipId, Record<VoiceTone, string>> = {
  intro: { official: introOfficial, voltaire: introVoltaire },
  quest_intro: { official: questIntroOfficial, voltaire: questIntroVoltaire },
  loc_study: { official: locStudyOfficial, voltaire: locStudyVoltaire },
  loc_gallery: { official: locGalleryOfficial, voltaire: locGalleryVoltaire },
  'art_potemkin-portrait': { official: artPotemkinOfficial, voltaire: artPotemkinVoltaire },
  'art_nobility-decree': { official: artNobilityOfficial, voltaire: artNobilityVoltaire },
  'art_voltaire-letter': { official: artVoltaireOfficial, voltaire: artVoltaireVoltaire },
  'art_nakaz-book': { official: artNakazOfficial, voltaire: artNakazVoltaire },
  'art_chesma-medal': { official: artChesmaOfficial, voltaire: artChesmaVoltaire },
  'art_tacitus-volume': { official: artTacitusOfficial, voltaire: artTacitusVoltaire },
  q1_prompt: { official: q1PromptOfficial, voltaire: q1PromptVoltaire },
  q1_correct: { official: q1CorrectOfficial, voltaire: q1CorrectVoltaire },
  q1_wrong: { official: q1WrongOfficial, voltaire: q1WrongVoltaire },
  q2_prompt: { official: q2PromptOfficial, voltaire: q2PromptVoltaire },
  q2_correct: { official: q2CorrectOfficial, voltaire: q2CorrectVoltaire },
  q2_wrong: { official: q2WrongOfficial, voltaire: q2WrongVoltaire },
  q3_prompt: { official: q3PromptOfficial, voltaire: q3PromptVoltaire },
  q3_correct: { official: q3CorrectOfficial, voltaire: q3CorrectVoltaire },
  q3_wrong: { official: q3WrongOfficial, voltaire: q3WrongVoltaire },
  q4_prompt: { official: q4PromptOfficial, voltaire: q4PromptVoltaire },
  q4_correct: { official: q4CorrectOfficial, voltaire: q4CorrectVoltaire },
  q4_wrong: { official: q4WrongOfficial, voltaire: q4WrongVoltaire },
  q5_prompt: { official: q5PromptOfficial, voltaire: q5PromptVoltaire },
  q5_correct: { official: q5CorrectOfficial, voltaire: q5CorrectVoltaire },
  q5_wrong: { official: q5WrongOfficial, voltaire: q5WrongVoltaire },
  q6_prompt: { official: q6PromptOfficial, voltaire: q6PromptVoltaire },
  q6_correct: { official: q6CorrectOfficial, voltaire: q6CorrectVoltaire },
  q6_wrong: { official: q6WrongOfficial, voltaire: q6WrongVoltaire },
  q7_prompt: { official: q7PromptOfficial, voltaire: q7PromptVoltaire },
  q7_correct: { official: q7CorrectOfficial, voltaire: q7CorrectVoltaire },
  q7_wrong: { official: q7WrongOfficial, voltaire: q7WrongVoltaire },
  verdict_pass: { official: verdictPassOfficial, voltaire: verdictPassVoltaire },
  verdict_fail: { official: verdictFailOfficial, voltaire: verdictFailVoltaire },
};
