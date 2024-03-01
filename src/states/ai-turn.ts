import {GameState} from "@/components/game-state";
import {state} from "@/store/store";
import {Engine} from "excalibur";
import {AiPlayer} from "@/actors/ai/ai-player";

export class AiTurn extends GameState{
  static stateName = "aiTurn";

  constructor() {
    super();
    this.stateName = AiTurn.stateName;
  }


  onEnter() {
    console.log("AI turn ");
  }

  onExit() {
    console.log("End of AI turn");
  }

  onUpdate(engine:Engine, delta:number) {
    let board = state.boardManager.currentBoard;
    // generate move here from AI
    let aiPlayer:  AiPlayer  = state.opponent;
    aiPlayer.takeTurn();
    this.nextState = "playerTurn"
  }

}