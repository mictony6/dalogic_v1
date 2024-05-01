import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import type {CaptureMove} from "@/components/capture-move";
import {SwitchingTurn} from "@/states/switching-turn";
import {PlayerTurn} from "@/states/player-turn";
import { AiPlayer } from "@/actors/ai/ai-player";

export class CheckDoubleCapture extends GameState{
  static stateName = "checkDoubleCapture";
  private captureMoves : CaptureMove[] = [];

  constructor() {
    super();
    this.stateName = CheckDoubleCapture.stateName;
  }

  onEnter(engine: Engine) {
    const board :Board = state.boardManager.currentBoard;

    const lastMove : CaptureMove = board.selectedMove as CaptureMove;
    // check possible capture moves from the last move's destination
    this.captureMoves = board.getValidCaptureMoves(lastMove.destPos.piece);
    board.selectedMove = null;

    //highlight the possible capture moves
    this.captureMoves.forEach((move) => {
      move.destPos.tile.highlight();
    })

    if (this.captureMoves.length > 0){
      board.selectedSrcCell = this.captureMoves[0].srcPos;
      this.nextState = PlayerTurn.stateName;
    }
  }

  onUpdate(engine: Engine, delta: number) {
 
    if (this.captureMoves.length === 0){
      this.nextState = SwitchingTurn.stateName;
      return;
    }


    // else if (this.captureMoves.length === 1){
    //   board.selectedMove = this.captureMoves[0];
    //   this.nextState = PlayerMoving.stateName;
    // } else{
    //   // if there are multiple capture moves, let the player choose one
    //   // if the player has selected a move, move to the capture state
    //
    //   if (board.selectedMove){
    //     this.nextState = PlayerMoving.stateName;
    //   }
    // }


  }

}