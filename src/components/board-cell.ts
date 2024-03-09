import {Piece} from "@/actors/piece/piece";
import {BoardTile} from "@/actors/tile/tile";
import {Actor, BaseAlign, Color, Engine, Font, Label, TextAlign} from "excalibur";
import { pattern } from "./operations";



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

    if (this.tile.isBlack) return;
    let operation = pattern[this.tile.row][this.tile.col];
    let operationName = operation.name
    
    // display operation name on the tile
    let operationLabel = new Label({
      text: operationName,
      font: new Font({size: 20, color: Color.Black, textAlign: TextAlign.Center, baseAlign: BaseAlign.Middle}),
      color: Color.Black,
    })

    this.addChild(operationLabel);
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

  removePieceFromCell(){
    this.removeChild(this.piece);
    this.piece = null;
  }


}
