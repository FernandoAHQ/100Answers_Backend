import { IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  public: boolean;
  @IsString()
  statement: string;
  @IsArray()
  answers: {
    text: string;
    points: number;
  }[];
}
