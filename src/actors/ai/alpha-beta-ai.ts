import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";
import type Move from "@/components/move";
import type {Board} from "@/actors/board/board";
import type {CaptureMove} from "@/components/capture-move";


export class AlphaBetaAi extends AiPlayer {

  minimax(depth : number, maximizingPlayer : boolean, board : Board, alpha : number = -Infinity, beta : number = Infinity, pos: Move|CaptureMove) : [number, Move|CaptureMove]{
    if (depth === 0 || board.isOver()){

      return [board.evaluate(this), pos];
    }

    if (maximizingPlayer){

      let maxEval : number = -Infinity;
      let bestMove : Move;


      let moves = board.getAllValidMoves(this);
      for (let move of moves) {
        move.commit();
        let currentEval  = this.minimax(depth-1, false,board, alpha, beta , move)[0];
        move.revert()

        if(currentEval > maxEval){
          maxEval = currentEval;
          bestMove = move;
        }

        alpha = Math.max(alpha, currentEval);
        if (beta <= alpha) {
          break
        }
      }
      return[maxEval, bestMove];

    } else {
      let minEval = Infinity;

      const otherPlayer = state.currentPlayerID === state.opponent["playerID"] ? state.player : state.opponent;
      let moves = board.getAllValidMoves(otherPlayer);

      for (let move of moves) {
        move.commit();
        let currentEval = this.minimax( depth - 1, true, board, alpha, beta, move)[0];
        move.revert();

        if (currentEval < minEval) {
          minEval = currentEval;
        }

        beta = Math.min(beta, currentEval);
        if (beta <= alpha) {
          break;
        }

      }
      return [minEval, null];
    }
  }

  getBestMove(){
    const board : Board = state.boardManager.currentBoard;
    let res= this.minimax(3, true, board, -Infinity, Infinity, null);
    console.log(res[0]);
    return res[1]

  }

  takeTurn() {
    let bestMove : Move = this.getBestMove();
    if (bestMove) {
      bestMove.commit()
    } else {
      let board : Board = state.boardManager.currentBoard
      board.isGameOver = true;
    }
  }

}
