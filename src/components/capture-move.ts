import Move from "@/components/move";
import BoardCell from "@/components/board-cell";
import {Piece} from "@/actors/piece/piece";
import {pattern} from "@/components/operations";
import {state} from "@/store/store";
import {Board} from "@/actors/board/board";

export class CaptureMove extends Move{
  public capturedPiece : Piece;
  public points : number;
  constructor(src:BoardCell, dest: BoardCell, public mid : BoardCell) {
    super(src, dest);
    if (!mid.piece){
      throw new Error("how the fuck is this null")
    }
    this.capturedPiece = mid.piece;
  }
  commit() {
    // calculate score
    let operation = pattern[this.destPos.tile.row][this.destPos.tile.col];
    this.points = operation(this.srcPos.piece.value, this.capturedPiece.value);

    // TODO : create pop up here

    this.srcPos.piece.owner.addScore(this.points);
    // console.log("operation result:", this.points);
    // remove from cell

    let board : Board= state.boardManager.currentBoard;
    board.removePieceFromBoard(this.mid);

    super.commit();
  }

  revert() {
    // do something about the score

    // revert the captured piece
    let board : Board= state.boardManager.currentBoard;
    board.addPieceToBoard(this.capturedPiece);
    this.destPos.piece.owner.addScore(-this.points);
    super.revert()
  }
}