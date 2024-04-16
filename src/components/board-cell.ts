import type {BoardTile} from "@/actors/tile/tile";
import {Actor, BaseAlign, Color, type Engine, Font, Label, TextAlign} from "excalibur";
import type {Piece} from "@/actors/piece/piece";
import {AND, NAND, OR, pattern, XOR} from "@/components/operations";


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
    const operation = pattern[this.tile.row][this.tile.col];

    let operationName : string;
    switch(operation){
      case AND:
        operationName = "AND";
        break;
      case OR:
        operationName = "OR";
        break;
      case XOR:
        operationName = "XOR";
        break;
      case NAND:
        operationName = "NAND";
        break;
    }

    // display operation name on the tile
    const operationLabel = new Label({
      text: operationName,
      font: new Font({family:'Consolas',size: 20, color: Color.Black, textAlign: TextAlign.Center, baseAlign: BaseAlign.Middle}),
      color: Color.Black,
    })

    this.addChild(operationLabel);
  }


  /**
   * Proper way to transfer piece from one cell to another.
   * This modifies the piece's row and column.
   * @param otherPosition {BoardCell}
   */
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

  addPieceToCell(piece:Piece){
    this.addChild(piece);
    this.piece = piece;
  }


}
