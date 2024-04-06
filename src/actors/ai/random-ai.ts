import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";
import type Move from "@/components/move";
import type {CaptureMove} from "@/components/capture-move";

export class RandomAi extends AiPlayer {

  takeTurn() {
    let randomMove = this.getBestMove();
    randomMove.commit();

  }

  getBestMove(): Move | CaptureMove {
    const validMoves = state.boardManager.currentBoard.getAllValidMoves(this);
    return validMoves[Math.floor(Math.random()*validMoves.length)];
  }

}