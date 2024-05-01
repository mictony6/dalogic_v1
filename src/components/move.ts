import {Entity} from "excalibur";
import type BoardCell from "@/components/board-cell";
import type {Board} from "@/actors/board/board";
import {CaptureMove} from "@/components/capture-move";
import { state } from "@/store/store";
import type { Piece } from "@/actors/piece/piece";

export default class Move extends Entity{
  srcPos: BoardCell;
  destPos:BoardCell;
  private removedPiece: Piece;

  constructor(src:BoardCell, dest: BoardCell) {
    super();
    if (!src.piece){
      throw new Error("the fuck? ")
    }
    this.srcPos = src;
    this.destPos = dest;
  }

  equal(other:Move){
    return this.srcPos.equal(other.srcPos) && this.destPos.equal(other.destPos);
  }

  /**
   * Call this to truly execute the move
   */
  commit(){
    // transfer ownership
    this.srcPos.transferPieceTo(this.destPos);

    const board = state.boardManager.currentBoard;
    if (this.destPos.tile.row === 7 || this.destPos.tile.row === 0 ){
      const pieceValue = Math.max(this.removedPiece.value * 2, 1);
      board.currentPlayer.addScore(pieceValue);
      this.removedPiece = this.destPos.piece
      board.removePieceFromBoard(this.removedPiece);
      
    }
  }


  get hash() {
    // Encode relevant information into hash
    const srcRow = this.srcPos.tile.row;
    const srcCol = this.srcPos.tile.col;
    const destRow = this.destPos.tile.row;
    const destCol = this.destPos.tile.col;
    return `${srcRow}-${srcCol}-${destRow}-${destCol}`;
  }

  revert() {
    const board = state.boardManager.currentBoard;
    if (this.destPos.tile.row === 7 || this.destPos.tile.row === 0 ){
      const pieceValue = Math.max(this.removedPiece.value * 2, 1);
      board.currentPlayer.addScore(-pieceValue);
      board.addPieceToBoard(this.removedPiece)
       
    }
    this.destPos.transferPieceTo(this.srcPos);

  }

  static fromHash(hash:string, board:Board){
    // create a move from hash given
    const details = hash.split('-')
    const srcRow = parseInt(details[0])
    const srcCol = parseInt(details[1])
    const destRow = parseInt(details[2])
    const destCol = parseInt(details[3])


    const srcCell: BoardCell = board.getBoardCellAt(srcRow, srcCol);
    const destCell:BoardCell = board.getBoardCellAt(destRow, destCol);

    // check if jump 
    if (Math.abs(srcRow - destRow) > 1 || Math.abs(srcCol - destCol) > 1) {
      const midCell: BoardCell = board.getBoardCellAt((srcRow + destRow) / 2, (srcCol + destCol) / 2);
      return new CaptureMove(srcCell, destCell, midCell);
    }
    return new Move(srcCell, destCell);
  }
}