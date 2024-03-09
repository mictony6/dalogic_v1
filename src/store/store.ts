
import {GameStateMachine} from "@/components/game-state-machine";
import {BoardManager} from "@/components/board-manager";


export enum GameMode {
  AIVsPlayer = 0,
  AIvsAI = 1,
  PlayerVsPlayer = 2,
}


export let state = {
  TILE_SIZE: 75,
  gameMode: GameMode.AIvsAI,
  player: null,
  opponent: null ,
  currentPlayerID: "",
  firstMoveID: "",
  stateMachine: null,
  boardManager: null
}


export function initStore() {
  state.stateMachine = new GameStateMachine();
  state.boardManager = new BoardManager();

}

