import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import {PlayerMoving} from "@/states/player-moving";
import {millisecondsToMinutesSeconds} from "@/components/helpers";


export class PlayerTurn extends GameState{
  static stateName = "playerTurn";
  private timeLeft: string ;
  private lastTimeLeft: string ;

  constructor() {
    super();
    this.stateName = PlayerTurn.stateName;
  }


  onEnter(engine : Engine) {
    console.log("timer has started");
    const board : Board = state.boardManager.currentBoard;
    if (board.isOver()){
      this.nextState = "gameOver";
      return;
    }
    engine.add(board.currentPlayer.timer);
    board.currentPlayer.timer.start()


  }

  onExit(engine: Engine) {
    const board : Board = state.boardManager.currentBoard;

    engine.remove(board.currentPlayer.timer);
    board.currentPlayer.timer.pause()

    console.log("End of turn and timer is stopped.");
  }

  onUpdate(_engine:Engine, _delta:number) {
    const board : Board = state.boardManager.currentBoard;

    if (board.currentPlayer.timer.isRunning && state.isPaused){
      
      board.currentPlayer.timer.pause();
      return;
    } else if (!board.currentPlayer.timer.isRunning && !state.isPaused) {
      board.currentPlayer.timer.resume();
    }

    const currentTimeLeft  = millisecondsToMinutesSeconds(board.currentPlayer.timer.timeToNextAction);
    // only update timeleft if it changed in whole numbers 
    if (this.lastTimeLeft !== currentTimeLeft){
      this.timeLeft = currentTimeLeft;      
      dispatchEvent(new CustomEvent("turntimer-tick", {detail:this.timeLeft}));
      this.lastTimeLeft = currentTimeLeft;
    }

    if (state.currentPlayerID !== state.player["playerID"]){
      return
    }
    
    // if both a source and destination cell are selected, commit the move
    if (board.selectedSrcCell && board.selectedDestCell){
      // create a move object
      board.selectedMove = board.getEquivalentMove(board.selectedSrcCell, board.selectedDestCell)
      if(board.selectedMove){
        dispatchEvent(new CustomEvent("playerMove", {detail:board.selectedMove}));
        this.nextState = PlayerMoving.stateName;
      }else {
        console.log("Invalid move");
        board.resetSelections()
      }
    }
  }

}