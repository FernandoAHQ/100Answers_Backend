import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './interfaces/question.interface';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
  }

  //   async remove(id: string): Promise<Question> {
  //     return this.questionModel.findByIdAndRemove(id).exec();
  //   }
}
