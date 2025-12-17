export enum AppMode {
  HOME = 'HOME',
  PRODUCT = 'PRODUCT',
  CHARACTER = 'CHARACTER',
  BLENDER = 'BLENDER',
  PROMPT_VIDEO = 'PROMPT_VIDEO'
}

export interface ImageFile {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

export interface GeneratedResult {
  imageUrl: string;
  promptUsed: string;
}

export type Language = 'en' | 'id';

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

// Video Prompt Generator Types
export interface VideoCharacter {
  id: string;
  name: string;
  ageGender: string;
  physical: string;
  clothing: string;
  posture: string;
  expression: string;
}

export interface VideoDialog {
  id: string;
  characterName: string;
  text: string;
}

export interface VideoScene {
  title: string;
  location: string;
  subjectAction: string;
  dialogs: VideoDialog[];
  supportingSubjects: string;
  visualDetails: string;
  emotion: string;
  camera: string;
  effects: string;
}

export interface VideoPromptData {
  // General
  type: string;
  duration: string;
  visualStyle: string;
  audioStyle: string;
  language: string;
  aspectRatio: string;
  resolution: string;
  reference: string;
  notes: string;
  // Characters
  characters: VideoCharacter[];
  // Scene (Single detailed scene based on request)
  scene: VideoScene;
}

export interface PromptGenOutput {
  english: string;
  indonesian: string;
  json: string;
  simple: string;
}