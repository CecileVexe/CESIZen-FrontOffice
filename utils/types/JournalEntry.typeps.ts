import { Emotion } from "./Emotion.types";

export interface JournalEntrys {
  id: string;
  date: string;
  emotion: Emotion;
}

export interface Journal {
  id: string;
  userId: string;
  updatedAt: string;
  entries: JournalEntrys[];
}

export interface JournalEntry {
  id: string;
  date: string;
  emotionId: string;
  description: string;
}
