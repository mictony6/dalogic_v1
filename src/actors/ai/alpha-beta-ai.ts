import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";
import type Move from "@/components/move";
import type {Board} from "@/actors/board/board";


export class AlphaBetaAi extends AiPlayer {

  minimax(depth : number, maximizingPlayer : boolean, board : Board, alpha : number = -Infinity, beta : number = Infinity){
    if (depth === 0 || board.isOver()){
      return board.evaluate(this);
    }

    if (maximizingPlayer){

      let maxEval : number = -Infinity;
      let bestMove : Move;


      let moves = board.getAllValidMoves(this);
      for (let move of moves) {
        move.commit();
        let currentEval  = this.minimax(depth-1, false,board, alpha, beta )[0];
        move.revert()

        if(currentEval >= maxEval){
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
        let currentEval = this.minimax( depth - 1, true, board, alpha, beta)[0];
        move.revert();

        if (currentEval <= minEval) {
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
    return this.minimax(6, true, board)[1];

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
