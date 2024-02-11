import { Actor, Color } from 'excalibur';


export class BoardTile extends Actor {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    super({
      width: 75,
      height: 75,
      color: (row + col) % 2 === 1 ? Color.White: Color.Black
    });

    this.row = row;
    this.col = col;

  }
  onInitialize() {

  }


}
