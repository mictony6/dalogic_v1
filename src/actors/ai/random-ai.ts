import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";

export class RandomAi extends AiPlayer {
  constructor(forward: number) {
    super(forward);
  }

  takeTurn() {
    let validMoves = state.boardManager.currentBoard.getAllValidMoves(this);
    console.log(validMoves);
    let randomMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    console.log(randomMove);
    randomMove.finalize();
  }

}