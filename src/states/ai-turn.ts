import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import type {AiPlayer} from "@/actors/ai/ai-player";
import {GameOver} from "@/states/game-over";
import {SwitchingTurn} from "@/states/switching-turn";


export class AiTurn extends GameState{
  static stateName = "aiTurn";

  constructor() {
    super();
    this.stateName = AiTurn.stateName;
  }


  onEnter(engine:Engine) {
    console.log("AI turn ");
    const board : Board = state.boardManager.currentBoard;
    // generate move here from AI
    const aiPlayer:  AiPlayer  = state.currentPlayerID === state.opponent["playerID"] ? state.opponent : state.player;
    aiPlayer.takeTurn();
    if (board.isGameOver){
      this.nextState = GameOver.stateName;
    }else {

      this.nextState = SwitchingTurn.stateName;
    }

  }

  onExit() {
    console.log("End of AI turn");
  }



}