import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";

export class RandomAi extends AiPlayer {

  takeTurn() {
    let validMoves = state.boardManager.currentBoard.getAllValidMoves(this);
    let randomMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    randomMove.commit();

  }

}