import {GameState} from "@/components/game-state";
import {state} from "@/store/store";
import {Engine, Timer} from "excalibur";
import {Board} from "@/actors/board/board";
import { PlayerMoving } from "./player-moving";
import { SwitchingTurn } from "./switching-turn";


function millisToMinutesAndSeconds(millis) {
  let date = new Date(millis);
  return (`${date.getMinutes()}:${date.getSeconds()}`);
}

export class PlayerTurn extends GameState{
  static stateName = "playerTurn";
  private timeLeft: string ;
  private lastTimeLeft: string ;

  constructor() {
    super();
    this.stateName = PlayerTurn.stateName;
    // this.turnTimer = new Timer({
    //   fcn: ()=>{
    //     this.nextState = SwitchingTurn.stateName;
    //   },
    //   interval: 10000
    // });

  }


  onEnter(engine : Engine) {
    console.log("timer has started");
    let board : Board = state.boardManager.currentBoard;
    engine.add(board.currentPlayer.timer);
    board.currentPlayer.timer.start()


  }

  onExit(engine: Engine) {
    let board : Board = state.boardManager.currentBoard;

    engine.remove(board.currentPlayer.timer);
    board.currentPlayer.timer.pause()

    console.log("End of turn and timer is stopped.");
  }

  onUpdate(engine:Engine, delta:number) {
    let board : Board = state.boardManager.currentBoard;


    let currentTimeLeft  = millisToMinutesAndSeconds(board.currentPlayer.timer.timeToNextAction);
    console.log(currentTimeLeft);
    // only update timeleft if it changed in whole numbers 
    if (this.lastTimeLeft !== currentTimeLeft){
      this.timeLeft = currentTimeLeft;
      dispatchEvent(new CustomEvent("turntimer-tick", {detail:this.timeLeft}));
      
    }
    

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