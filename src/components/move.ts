import {Entity} from "excalibur";
import BoardCell from "@/components/board-cell";

export default class Move extends Entity{
  srcPos: BoardCell;
  destPos:BoardCell;

  constructor(src:BoardCell, dest: BoardCell) {
    super();
    this.srcPos = src;
    this.destPos = dest;
  }

  equal(other:Move){
    return this.srcPos.equal(other.srcPos) && this.destPos.equal(other.destPos);
  }

  /**
   * Call this to truly execute the move
   */
  finalize(){
    this.srcPos.transferPieceTo(this.destPos);
  }
}