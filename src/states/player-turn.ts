import {GameState} from "@/components/game-state";
import {state} from "@/store/store";
import {Engine, Timer} from "excalibur";
import {Board} from "@/actors/board/board";
import { PlayerMoving } from "./player-moving";
import { SwitchingTurn } from "./switching-turn";

export class PlayerTurn extends GameState{
  static stateName = "playerTurn";
  private turnTimer : Timer ;

  constructor() {
    super();
    this.stateName = PlayerTurn.stateName;
    this.turnTimer = new Timer({
      fcn: () => {
        this.nextState = SwitchingTurn.stateName;
      },
      interval: 10000
    });

  }


  onEnter(engine : Engine) {
    console.log("timer has started");
    engine.add(this.turnTimer);
    this.turnTimer.start();

  }

  onExit(engine: Engine) {
    this.turnTimer.stop();
    engine.remove(this.turnTimer);
    console.log("End of turn and timer is stopped.");
  }

  onUpdate(engine:Engine, delta:number) {
    console.log(this.turnTimer.timeElapsedTowardNextAction);
    
    let board : Board = state.boardManager.currentBoard;
    // if both a source and destination cell are selected, commit the move
    if (board.selectedSrcCell && board.selectedDestCell){
      // create a move object
      board.selectedMove = board.getEquivalentMove(board.selectedSrcCell, board.selectedDestCell)
      if(board.selectedMove){
        this.nextState = PlayerMoving.stateName;
      }else {
        console.log("Invalid move");
        board.resetSelections()
      }
    }
  }

}