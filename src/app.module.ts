import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModule } from './question/question.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://fercho:Fercho2129@cluster0.csad12j.mongodb.net/100questions?retryWrites=true&w=majority',
    ),
    QuestionModule,
    SocketModule,
  ], //"test?retryWrites=true&w=majority')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
