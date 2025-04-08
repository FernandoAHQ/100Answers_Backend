import { Document } from 'mongoose';

export interface Question extends Document {
  public: boolean;
  statement: string;
  answers: {
    text: string;
    points: number;
  }[];
}
