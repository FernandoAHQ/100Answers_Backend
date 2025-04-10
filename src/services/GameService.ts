import { Injectable } from '@nestjs/common';
import { GameSession } from 'src/gameLogic/GameSession';
import { NewGameConfig } from 'src/gameLogic/types';

@Injectable()
export class GameService {
  private sessions = new Map<string, GameSession>();
  private gameCodes = new Set<string>();

  verifyCode(id: string): {
    isValid: boolean;
    availableTeams: string[] | null;
  } {
    const session = this.sessions.get(id);
    let availableTeams = null;
    let isValid = false;

    if (session) {
      availableTeams = !session.randomTeam
        ? this.getAvailableTeams(session)
        : null;
      isValid = true;
    }
    return { isValid, availableTeams };
  }

  getAvailableTeams(session: GameSession): string[] {
    const teams: string[] = [];
    session.teams.forEach((team, teamName) => {
      if (team.players.size < session.teamSize) {
        console.log('ADDED: ', teamName);

        teams.push(teamName);
      }
    });

    return teams;
  }

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
