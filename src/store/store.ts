import {GameStateMachine} from "@/components/game-state-machine";
import {BoardManager} from "@/components/board-manager";
import {SceneManager} from "@/ui/scene-manager";
import type {Engine} from "excalibur";

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
  server:'https://dalogic-backend.onrender.com/',
}


export let sceneManager : SceneManager;
export function initStore(engine : Engine) {
  state.stateMachine = new GameStateMachine();
  sceneManager = new SceneManager(engine)

  state.boardManager = new BoardManager();

}

