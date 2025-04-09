import { NewGameConfig } from './types';

enum GameState {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

enum RoundMoment {
  FACE_OFF = 'FACE_OFF',
  MAIN = 'MAIN',
  STEAL = 'STEAL',
  END = 'END',
}

interface Team {
  players: Map<string, string>; //id, name
  points: number;
}

export class GameSession {
  id: string;
  state: GameState = GameState.WAITING_FOR_PLAYERS;
  teams: Map<string, Team> = new Map<string, Team>();
  teamSize: number;
  randomTeam: boolean;
  currentTeam: string;
  roundMoment: RoundMoment = RoundMoment.FACE_OFF;
  currentRound: number = 1;
  totalRounds: number = 5;

  constructor(
    hostId: string,
    { team1, team2, teamSize, randomTeam }: NewGameConfig,
  ) {
    this.id = 'TEST SESSION';
    this.teams
      .set(team1, {
        players: new Map<string, string>(),
        points: 0,
      })
      .set(team2, {
        players: new Map<string, string>(),
        points: 0,
      });
    this.teamSize = teamSize;
    this.randomTeam = randomTeam;
    this.currentTeam = team1;
    console.log('NEW GAME SESSION CREATED', this.id);
    console.log('GAME HOST', hostId);
  }
}
