import {GameState} from "@/components/game-state";
import {state} from "@/store/store";
import {Engine} from "excalibur";
import {AiPlayer} from "@/actors/ai/ai-player";
import {SwitchingTurn} from "@/states/switching-turn";
import {Board} from "@/actors/board/board";
import {GameOver} from "@/states/game-over";

export class AiTurn extends GameState{
  static stateName = "aiTurn";

  constructor() {
    super();
    this.stateName = AiTurn.stateName;
  }


  onEnter(engine:Engine) {
    console.log("AI turn ");
    let board : Board = state.boardManager.currentBoard;
    // generate move here from AI
    let aiPlayer:  AiPlayer  = state.currentPlayerID === state.opponent["playerID"] ? state.opponent : state.player;
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