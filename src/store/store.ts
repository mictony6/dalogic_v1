import {BoardManager} from "@/components/board-manager";
import {SceneManager} from "@/ui/scene-manager";
import type {Engine} from "excalibur";
import {GameStateMachine} from "@/components/game-state-machine";
import type {Player} from "@/actors/player/player";
import type {Socket} from "socket.io-client";


export enum GameMode {
  AIVsPlayer = 0,
  AIvsAI = 1,
  PlayerVsPlayer = 2,
}

export let sceneManager : SceneManager;

export class Store {
  TILE_SIZE : number = 75;
  gameMode : GameMode=  GameMode.AIVsPlayer;
  player : Player = null;
  opponent : Player  = null ;
  currentPlayerID : string =  "";
  firstMoveID : string =  "";
  stateMachine : GameStateMachine ;
  boardManager : BoardManager ;
  socket : Socket =  null;
  roomID : string = "";
  server = 'https://dalogic-backend.onrender.com/';
  practiceLevel: number = 0;
  isPaused: boolean =  false;
  private static _instance: Store;
  playerName: string = "";

  constructor(engine : Engine){

    this.stateMachine = new GameStateMachine();

    this.boardManager = new BoardManager();




  }

}

export let state : Store = null;
export function initStore(engine : Engine){
  if (state) return;
  sceneManager = new SceneManager(engine)
  state = new Store(engine);
  console.log(state)
}

