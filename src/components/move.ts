import {Entity} from "excalibur";
import BoardCell from "@/components/board-cell";
import { Board } from "@/actors/board/board";
import { CaptureMove } from "./capture-move";

export default class Move extends Entity{
  srcPos: BoardCell;
  destPos:BoardCell;

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
    this.destPos.transferPieceTo(this.srcPos);
  }

  static fromHash(hash:string, board:Board){
    // create a move from hash given
    let details = hash.split('-')
    let srcRow = parseInt(details[0])
    let srcCol = parseInt(details[1])
    let destRow = parseInt(details[2])
    let destCol = parseInt(details[3])


    let srcCell: BoardCell = board.getBoardCellAt(srcRow, srcCol);
    let destCell:BoardCell = board.getBoardCellAt(destRow, destCol);

    // check if jump 
    if (Math.abs(srcRow - destRow) > 1 || Math.abs(srcCol - destCol) > 1) {
      let midCell: BoardCell = board.getBoardCellAt((srcRow + destRow) / 2, (srcCol + destCol) / 2);
      return new CaptureMove(srcCell, destCell, midCell);
    }
    return new Move(srcCell, destCell);
  }
}