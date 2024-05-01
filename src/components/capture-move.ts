import Move from "@/components/move";
import type {Piece} from "@/actors/piece/piece";
import type BoardCell from "@/components/board-cell";
import {AND, NAND, OR, pattern, XOR} from "@/components/operations";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";


export class CaptureMove extends Move{
  public capturedPiece : Piece;
  public points : number;
  public operationName : string;
  constructor(src:BoardCell, dest: BoardCell, public mid : BoardCell) {
    super(src, dest);
    if (!mid.piece){
      throw new Error("how the fuck is this null")
    }
    this.capturedPiece = mid.piece;    
    const operation = pattern[this.destPos.tile.row][this.destPos.tile.col];
    switch (operation){
      case AND:
        this.operationName = "AND";
        break;
      case OR:
        this.operationName = "OR";
        break;
      case XOR:
        this.operationName = "XOR";
        break;
      case NAND:
        this.operationName = "NAND";
        break;
    }
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
    const board : Board= state.boardManager.currentBoard;
    board.removePieceFromBoard(this.mid);

    super.commit();
  }

  revert(answeredCorrect : boolean = true) {
    
    // revert the captured piece
    super.revert()
    // do something about the score
    const board : Board= state.boardManager.currentBoard;
    board.addPieceToBoard(this.capturedPiece);
    if (answeredCorrect){
      this.srcPos.piece.owner.addScore(-this.points);
    } else{
      this.capturedPiece.owner.addScore(-this.points);
    }

  }
}