import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/services/GameService';
import { serializeTeams } from 'src/utils/serialization';

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

      const session = this.gameService.createSession(payload);
      socket.join(`${session.id}_HOST`);
      console.log(session.teams.values);

      this.server.to(`${session.id}_HOST`).emit('gameCreated', {
        gameId: session.id,
        teams: [...session.teams.keys()],
      });
    });

    socket.on('checkCode', ({ gameId }: { gameId: string }) => {
      const { isValid, availableTeams } = this.gameService.verifyCode(gameId);
      console.log(availableTeams);

      socket.emit('codeChecked', { gameId, isValid, availableTeams });
    });

    socket.on(
      'requestJoinGame',
      (payload: { gameId: string; name: string; team: string }) => {
        const teams = serializeTeams(
          this.gameService.joinPlayer(clientId, payload),
        );

        socket.join(`${payload.gameId}_PLAYERS`);

        this.server
          .to(`${payload.gameId}_HOST`)
          .emit('playerJoined', { teams });

        this.server
          .to(`${payload.gameId}_MONITORS`)
          .emit('playerJoined', { teams });

        socket.to(`${payload.gameId}_PLAYERS`).emit('playerJoined', { teams });

        socket.emit('joinedGame', { isAccepted: true, teams });
      },
    );

    socket.on('requestJoinMonitor', ({ gameId }: { gameId: string }) => {
      const session = this.gameService.getSession(gameId);
      if (!session) return socket.emit('joinedMonitor', { isAccepted: false });

      const teams = serializeTeams(session.teams);

      socket.join(`${gameId}_MONITORS`);

      socket.emit('joinedMonitor', {
        isAccepted: true,
        gameState: { ...session, teams },
      });
    });

    socket.on('startGame', (payload: { gameId: string }) => {
      const session = this.gameService.startGame(payload.gameId);

      this.server
        .to(`${payload.gameId}_HOST`)
        .emit('gameStarted', { gameState: session });

      this.server
        .to(`${payload.gameId}_MONITORS`)
        .emit('gameStarted', { gameState: session });

      socket
        .to(`${payload.gameId}_PLAYERS`)
        .emit('gameStarted', { gameState: session });
    });
  }

  // Add more methods for handling events, messages, etc.
}
