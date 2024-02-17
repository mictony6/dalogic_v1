import {Player} from "@/actors/player/player";

export enum GameMode {
  AIVsPlayer = 0,
  AIvsAI = 1,
  PlayerVsPlayer = 2,
}

export let state = {
  TILE_SIZE: 75,
  gameMode: GameMode.AIVsPlayer,
  players: [new Player(), new Player()]
}

