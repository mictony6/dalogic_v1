import {AiPlayer} from "@/actors/ai/ai-player";
import  {type Board} from "@/actors/board/board";
import {state} from "@/store/store";
import  Move from "@/components/move";
import type {CaptureMove} from "@/components/capture-move";

export class ExpectimaxAi extends AiPlayer{

  private expectimax(depth: number, maximizingPlayer: boolean, board: Board) {
    if (depth === 0 || board.isOver()){
      return board.evaluate(this);
    }

    if (maximizingPlayer){

      let maxEval : number = -Infinity;
      let bestMove : Move;


      let moves = board.getAllValidMoves(this);
      for (let move of moves) {
        move.commit();
        let currentEval  = this.expectimax(depth-1, false,board )[0];
        move.revert()

        if(currentEval >= maxEval){
          maxEval = currentEval;
          bestMove = move;
        }
      }
      return[maxEval, bestMove];

    } else {
      const otherPlayer = state.currentPlayerID === state.opponent["playerID"] ? state.player : state.opponent;
      let moves = board.getAllValidMoves(otherPlayer);


      let total : number = 0
      for (let move of moves) {
        move.commit();
        let currentEval = this.expectimax( depth - 1, true, board)[0];
        move.revert();

        total += currentEval;

      }

      return [total/moves.length, null];
    }
  }

  getBestMove(): Move | CaptureMove {
    let board : Board =state.boardManager.currentBoard;
    return this.expectimax(4, true, board)[1];
  }

  takeTurn() {

    let bestMove : Move = this.getBestMove();
    if (bestMove){
      bestMove.commit()
    } else {
      let board : Board = state.boardManager.currentBoard
      board.isGameOver = true;
    }
  }
}