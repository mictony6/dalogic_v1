
import {GameStateMachine} from "@/components/game-state-machine";
import {BoardManager} from "@/components/board-manager";
import { Engine, Timer } from "excalibur";
import { Player } from "@/actors/player/player";


export enum GameMode {
  AIVsPlayer = 0,
  AIvsAI = 1,
  PlayerVsPlayer = 2,
}


export let state = {
  TILE_SIZE: 75,
  gameMode: GameMode.AIVsPlayer,
  player: null,
  opponent: null ,
  currentPlayerID: "",
  firstMoveID: "",
  stateMachine: null,
  boardManager: null,
  socket: null,
  roomID:"",
}


export function initStore() {
  state.stateMachine = new GameStateMachine();
  state.boardManager = new BoardManager();

}

