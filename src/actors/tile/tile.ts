import { Actor, Color, vec } from 'excalibur';
import { Resources } from '@/resources';
import {transform} from "terser-webpack-plugin/types/minify";

export class Tile extends Actor {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    super({
      width: 75,
      height: 75,
      color: (row + col) % 2 === 1 ? Color.fromHex('0x282814') : Color.fromHex('0x3c5028')
    });

    this.row = row;
    this.col = col;

  }
  onInitialize() {

  }


}
