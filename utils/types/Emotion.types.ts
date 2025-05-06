import { EmotionCategory } from "./EmotionCategory";

export interface Emotion {
  id: string;
  name: string;
  color: string;
  smiley: string;
  emotionCategory: EmotionCategory;
}
