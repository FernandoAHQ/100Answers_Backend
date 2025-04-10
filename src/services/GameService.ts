import { Injectable } from '@nestjs/common';
import { GameSession, Team } from 'src/gameLogic/GameSession';
import { NewGameConfig } from 'src/gameLogic/types';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class GameService {
  private sessions = new Map<string, GameSession>();
  private gameCodes = new Set<string>();

  constructor(private readonly questionService: QuestionService) {}

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

  joinPlayer(
    socketId: string,
    payload: {
      gameId: string;
      name: string;
      team: string;
    },
  ): Map<string, Team> {
    console.log(payload);
    const { gameId, name, team } = payload;
    const session = this.sessions.get(gameId);

    if (session) {
      session.addPlayerToTeam(socketId, name, team);
      console.log(`Player ${name} joined team ${team} in session ${gameId}`);
    } else {
      console.log(`Session ${gameId} does not exist`);
    }
    return this.sessions.get(gameId).teams;
  }

  startGame(gameId: string): GameSession {
    const session = this.sessions.get(gameId);
    if (session) {
      session.startGame();
      return session;
    } else {
      console.log(`Session ${gameId} does not exist`);
      return null;
    }
  }
}
