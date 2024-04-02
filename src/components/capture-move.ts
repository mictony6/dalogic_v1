import Move from "@/components/move";
import type {Piece} from "@/actors/piece/piece";
import type BoardCell from "@/components/board-cell";
import {pattern} from "@/components/operations";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";


export class CaptureMove extends Move{
  public capturedPiece : Piece;
  public points : number;
  constructor(src:BoardCell, dest: BoardCell, public mid : BoardCell) {
    super(src, dest);
    if (!mid.piece){
      throw new Error("how the fuck is this null")
    }
    this.capturedPiece = mid.piece;    
    let operation = pattern[this.destPos.tile.row][this.destPos.tile.col];
    this.points = operation(this.srcPos.piece.value, this.capturedPiece.value);
  }
  commit(answeredCorrect : boolean = true) {
    
    if (answeredCorrect){
      this.srcPos.piece.owner.addScore(this.points);
    }else{
      // give points to opponent
      this.capturedPiece.owner.addScore(this.points);
    }

    // remove from cell
    let board : Board= state.boardManager.currentBoard;
    board.removePieceFromBoard(this.mid);

    super.commit();
  }

  revert(answeredCorrect : boolean = true) {
    // do something about the score


    // revert the captured piece
    let board : Board= state.boardManager.currentBoard;
    board.addPieceToBoard(this.capturedPiece);
    if (answeredCorrect){
      this.destPos.piece.owner.addScore(-this.points);
    } else{
      this.capturedPiece.owner.addScore(-this.points);
    }
    super.revert()
  }
}