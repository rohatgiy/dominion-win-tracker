import { Player } from "@/types/player";

 export function usePlayers() : Player[] {
  const player1 = { id: 'rohatgiy', name: "yash", winCount: 16 };
  const player2 = { id: 'catlebag', name: "mak", winCount: 17 };
  const players = [player1, player2];

  return players;
}