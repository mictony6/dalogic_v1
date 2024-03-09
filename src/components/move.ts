import {Entity} from "excalibur";
import BoardCell from "@/components/board-cell";

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
}