import { Injectable } from '@nestjs/common';
import { GameSession } from 'src/gameLogic/GameSession';
import { NewGameConfig } from 'src/gameLogic/types';

@Injectable()
export class GameService {
  private sessions = new Map<string, GameSession>();
  private gameCodes = new Set<string>();

  getSession(id: string): GameSession {
    return this.sessions.get(id);
  }
  createSession(gameConfig: NewGameConfig): GameSession {
    const sessionId = this.generateGameCode();
    const newSession = new GameSession(sessionId, gameConfig);
    this.sessions.set(sessionId, newSession);
    // socket.to(newSession.id);
    return newSession;
  }

  private generateGameCode(): string {
    let code: string;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.gameCodes.has(code));

    return code;
  }

  private deleteGameCode(code: string): void {
    this.gameCodes.delete(code);
  }
}
