import {AiPlayer} from "@/actors/ai/ai-player";
import {state} from "@/store/store";
import type Move from "@/components/move";
import type {Board} from "@/actors/board/board";




export class MinimaxAi extends AiPlayer {

  minimax(depth : number, maximizingPlayer : boolean, board : Board){
    if (depth === 0 || board.isOver()){
      return board.evaluate(this);
    }

    if (maximizingPlayer){

      let maxEval : number = -Infinity;
      let bestMove : Move;


      let moves = board.getAllValidMoves(this);
      for (let move of moves) {
        move.commit();
        let currentEval  = this.minimax(depth-1, false,board )[0];
        move.revert()

        if(currentEval >= maxEval){
          maxEval = currentEval;
          bestMove = move;
        }
      }
      return[maxEval, bestMove];

    } else {
      let minEval = Infinity;

      const otherPlayer = state.currentPlayerID === state.opponent["playerID"] ? state.player : state.opponent;
      let moves = board.getAllValidMoves(otherPlayer);

      for (let move of moves) {
        move.commit();
        let currentEval = this.minimax( depth - 1, true, board)[0];
        move.revert();

        if (currentEval <= minEval) {
          minEval = currentEval;
        }
      }
      return [minEval, null];
    }
  }
  takeTurn() {

    let board : Board =state.boardManager.currentBoard;
    let bestMove : Move = this.minimax(3, true, board)[1];
    if (bestMove){
      bestMove.commit()
    } else {
      let board : Board = state.boardManager.currentBoard
      board.isGameOver = true;
    }
  }

}