import {Actor, Color, Engine, range, vec, Vector} from 'excalibur';
import {BoardTile} from "@/actors/tile/tile";
import {Piece} from "@/actors/piece/piece";

export class Board extends Actor {
  readonly dimension : Vector = vec(8,8)
  readonly halfSize : Vector;
  selectedTile : BoardTile;
  constructor() {
    super({
      color: Color.Red,
      width: 75*8,
      height:75*8
    });

    this.halfSize = vec(this.width/2, this.height/2);
  }

  get halfHeight(){
    return this.halfSize.y;
  }

  get halfWidth(){
    return this.halfSize.x
  }

  onInitialize(engine: Engine) {
    this.pos = engine.screen.center
    this.createTiles()
    let testPiece = new Piece()
    this.addChild(testPiece)

  }

  /**
   * Creates a bunch of tiles to fill the board
   */
  createTiles(){
    for (let row = 0; row < this.dimension.y; row++){
      for (let col = 0; col < this.dimension.x; col++){
        let tile : BoardTile = new BoardTile(row, col);
        tile.addTag(`tile:r${row}c${col}`);
        this.setTileBoardPosition(tile, row, col);

        // set tile listener for clicks
        tile.on("pointerdown", ()=>{
          this.selectTile(tile);
        });

        this.addChild(tile)
      }
    }
  }

  selectTile(tile: BoardTile){
    if (tile.isBlack){
      console.log("this tile is black")
      return
    }
    if (this.selectedTile){
      this.selectedTile.unhighlight()
      this.selectedTile = null
    }

    tile.highlight()
    this.selectedTile = tile
  }
  /**
   * set the tiles position vector to a corresponding row and col in the board
   */
  setTileBoardPosition(tile: BoardTile, row, col) {
    tile.row = row;
    tile.col = col;
    tile.pos = vec((col * 75) - this.halfWidth + tile.width / 2, (row * 75) - this.halfHeight + tile.height / 2);
  }
}
