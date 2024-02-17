import {Actor, Color, Engine, vec} from 'excalibur';
import {Piece} from "@/actors/piece/piece";


export class BoardTile extends Actor {
  row: number;
  col: number;
  defaultColor:Color;
  highlightedColor :Color = Color.Orange
  isBlack:boolean = false;
  piece: Piece = null;
  constructor(row: number, col: number) {
    super({
      width: 75,
      height: 75,
      color: (row + col) % 2 === 1 ? Color.Black: Color.White
    });

    this.isBlack = ((row + col) % 2 === 1)
    this.defaultColor = this.color;
    this.row = row;
    this.col = col;

  }

  highlight(){
    this.color = this.highlightedColor
  }

  unhighlight(){
    this.color = this.defaultColor
  }




}
