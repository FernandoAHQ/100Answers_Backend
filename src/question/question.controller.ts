import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getAllQuestions() {
    return this.questionService.findAll();
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Post('new')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }
}
