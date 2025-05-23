import { Team } from 'src/gameLogic/GameSession';

export function serializeTeams(map: Map<string, Team>) {
  const obj: Record<string, any> = {};
  map.forEach((team, key) => {
    obj[key] = {
      players: Array.from(team.players).map((player) => player[0]),
      points: team.points,
    };
  });
  return obj;
}
