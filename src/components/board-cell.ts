import {Piece} from "@/actors/piece/piece";
import {BoardTile} from "@/actors/tile/tile";
import {Actor, Engine} from "excalibur";

export default class BoardCell extends Actor{
  constructor(
    public tile: BoardTile,
    public piece: Piece | null,
  ) {
    super({width:75, height:75})

  }

  onInitialize(engine: Engine) {
    this.addChild(this.tile);
    if (this.piece){
      this.addChild(this.piece)
    }
  }


  transferPieceTo(otherPosition:BoardCell){
    this.piece.row = otherPosition.tile.row;
    this.piece.col = otherPosition.tile.col;
    this.removeChild(this.piece);
    otherPosition.piece = this.piece;
    otherPosition.addChild(otherPosition.piece);
    this.piece = null
  }

  equal(other:BoardCell){
    return this.tile === other.tile && this.piece === other.piece;
  }
}
