import {GameState} from "@/components/game-state";
import {state} from "@/store/store";
import {Engine} from "excalibur";
import {Board} from "@/actors/board/board";

export class PlayerTurn extends GameState{
  static stateName = "playerTurn";

  constructor() {
    super();
    this.stateName = PlayerTurn.stateName;
  }


  onEnter() {
    console.log("Your turn");
  }

  onExit() {
    console.log("End of turn");
  }

  onUpdate(engine:Engine, delta:number) {
    let board : Board = state.boardManager.currentBoard;
    // if both a source and destination cell are selected, commit the move
    if (board.selectedSrcCell && board.selectedDestCell){
      // create a move object
      board.selectedMove = board.getEquivalentMove(board.selectedSrcCell, board.selectedDestCell)
      if(board.selectedMove){
        this.nextState = "playerMoving";
      }else {
        console.log("Invalid move");
        board.resetSelections()
      }
    }
  }

}