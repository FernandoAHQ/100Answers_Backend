import { Injectable } from '@nestjs/common';
import { GameSession } from 'src/gameLogic/GameSession';
import { NewGameConfig } from 'src/gameLogic/types';

@Injectable()
export class GameService {
  private sessions = new Map<string, GameSession>();

  getSession(id: string): GameSession {
    return this.sessions.get(id);
  }
  createSession(hostId: string, gameConfig: NewGameConfig): GameSession {
    const newSession = new GameSession(hostId, gameConfig);
    this.sessions.set(newSession.id, newSession);
    // socket.to(newSession.id);
    return newSession;
  }
}
