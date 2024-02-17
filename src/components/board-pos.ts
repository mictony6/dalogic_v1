import {Vector} from "excalibur";

export class BoardPos extends Vector{
  row:number;
  col:number;
  constructor(x:number, y:number) {
    super(x, y);
    this.row = y/75
    this.col = x/75
  }

}