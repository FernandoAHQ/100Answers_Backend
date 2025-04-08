import { Schema } from 'mongoose';

export const QuestionSchema = new Schema({
  public: {
    type: Boolean,
    default: true,
  },
  statement: String,
  answers: [
    {
      text: String,
      points: Number,
    },
  ],
});
