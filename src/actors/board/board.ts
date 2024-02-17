import {Actor, Color, Engine, vec, Vector} from 'excalibur';
import {BoardTile} from "@/actors/tile/tile";
import {Piece} from "@/actors/piece/piece";
import BoardCell from "@/components/board-cell";
import Move from "@/components/move";
const TILE_SIZE = 75;

export class Board extends Actor {
  readonly dimension : Vector = vec(8,8)
  readonly halfSize : Vector;
  selectedSrcCell : BoardCell;
  selectedDestCell : BoardCell;
  selectedMove: Move;
  grid : BoardCell[][] = [];

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
    this.createBoard();

  }


  createBoard(){
    for (let row = 0; row < this.dimension.y; row++){
      let currentRow : BoardCell[] = []
      for (let col = 0; col < this.dimension.x; col++){

        // create a tile

        let tile : BoardTile = new BoardTile(row, col);
        tile.addTag(`tile:r${row}c${col}`);
        let piece : null | Piece = null;

        // if tile is white and in the first 3 or last 3 rows, add a piece
        if (!tile.isBlack && (row < 3 || row > 4)){
          piece = new Piece(row, col);
          piece.addTag(`piece:r${row}c${col}`);
        }
        let currentPos = this.getBoardPosition(row, col)
        let boardPos = new BoardCell(tile, piece);
        boardPos.on("pointerdown", ()=>{ this.selectBoardPos(boardPos)});
        boardPos.pos = currentPos;
        this.addChild(boardPos)
        currentRow.push(boardPos)

      }

      this.grid.push(currentRow)
    }
  }

  selectBoardPos(boardPos: BoardCell){

    let tile : BoardTile = boardPos.tile;
    let piece: Piece = boardPos.piece;

    // if the tile is black, do nothing
    if (tile.isBlack){
      console.log("this tile is black")
      return
    }

    if (piece){
      if (this.selectedSrcCell){
        this.selectedSrcCell.piece.unoutline();
      }
      this.selectedSrcCell = boardPos;
      piece.outline();
      return;
    }

    if (this.selectedSrcCell){
      if (this.selectedDestCell){
        this.selectedDestCell.tile.unhighlight();
      }
      this.selectedDestCell = boardPos;
      tile.highlight();
      return
    }

  }



  getBoardPosition(row: number, col: number){
    return vec((col * TILE_SIZE) - this.halfWidth + TILE_SIZE / 2, (row * TILE_SIZE) - this.halfHeight + TILE_SIZE / 2);
  }

  getBoardCell(boardObject: Piece | BoardTile){
    return this.grid[boardObject.row][boardObject.col];
  }

  onPostUpdate(engine: Engine, delta: number) {
    if (this.selectedSrcCell && this.selectedDestCell){

      this.selectedMove = new Move(this.selectedSrcCell, this.selectedDestCell);


      // check move validity here
      // finalize move if valid
      this.selectedMove.finalize()
      this.resetSelections()



      // this.selectedPiece.vel = this.selectedTile.getGlobalPos().sub(this.selectedPiece.getGlobalPos()).normalize().scale(50*delta);
      // if (this.selectedPiece.getGlobalPos().squareDistance(this.selectedTile.getGlobalPos()) <= 100){
      //
      //   let boardPos = this.grid[this.selectedTile.row][this.selectedTile.col];
      //
      //
      //   if (this.selectedTile.children.length > 0){
      //     throw new Error("Tile already has a piece");
      //   } else {
      //     this.selectedTile.addChild(this.selectedPiece);
      //   }
      //
      //   this.selectedPiece.vel = Vector.Zero;
      //   this.selectedPiece.pos = Vector.Zero;
      //   this.resetSelections();
      // }

    }
  }

  resetSelections(){
    this.selectedDestCell.piece.unoutline()
    this.selectedDestCell.tile.unhighlight()
    this.selectedSrcCell = null;
    this.selectedDestCell = null;
  }


  checkIfValidMove(tile: BoardTile, piece: Piece) {
    return true;
  }



}
