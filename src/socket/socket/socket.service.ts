import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/services/GameService';

@Injectable()
export class SocketService {
  private server: Server;
  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly gameService: GameService) {}

  setServer(server: Server) {
    this.server = server;
  }

  handleConnection(socket: Socket): void {
    console.log(`Client connected: ${socket.id}`);

    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    socket.on('requestNewGame', (payload) => {
      console.log(`New game requested by client: ${clientId}`);
      console.log(payload);

      const session = this.gameService.createSession(clientId, payload);
      socket.join(`${session.id}_HOST`);
      console.log(session.teams.values);

      this.server.to(`${session.id}_HOST`).emit('gameCreated', {
        gameId: session.id,
        teams: [...session.teams.keys()],
      });
    });
  }

  // Add more methods for handling events, messages, etc.
}
