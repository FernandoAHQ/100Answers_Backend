import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket/socket.service';
import { GameService } from 'src/services/GameService';

@Module({
  providers: [SocketGateway, SocketService, GameService],
})
export class SocketModule {}
