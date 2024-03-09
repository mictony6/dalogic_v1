import {Actor, Color, Engine, Scene, vec, Vector} from 'excalibur';
import {BoardTile} from "@/actors/tile/tile";
import {Piece} from "@/actors/piece/piece";
import BoardCell from "@/components/board-cell";
import Move from "@/components/move";
import {state} from "@/store/store";
import {Player} from "@/actors/player/player";
import {RandomAi} from "@/actors/ai/random-ai";
import {CaptureMove} from "@/components/capture-move";
const TILE_SIZE = state.TILE_SIZE;


export class Board extends Actor {
  readonly dimension : Vector = vec(8,8)
  readonly halfSize : Vector;
  selectedSrcCell : BoardCell;
  selectedDestCell : BoardCell;
  selectedMove: Move;
  grid : BoardCell[][] = [];
  // piece hash map
  pieces = new Map<number, Piece>();

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
    this.pos = engine.screen.center;

    this.createPlayers()

    this.createBoard();

    console.log(this.grid)

  }

  createPlayers(){
    state.player = new Player(-1);
    state.opponent = new RandomAi(1);
  }


  createBoard(){

    // TODO: assign values to the pieces

    // grid is a 2D array of BoardCells which contains the piece and tile in that specific row and column
    // using this data structure helps with ease of access
    // for retrieving a tile or piece on a specific position
    // transfer of pieces only involves reparenting it to a new BoardCell actor
    // removal on the other hand is handled in an abstracted function below 
    // which handles removing references of the piece on the player and the board

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
          piece.owner = row > 3 ? state.player : state.opponent;
          // add the piece id to the player's owned pieces array
          piece.owner.owns(piece);

          // add the piece to the board's pieces array
          this.pieces.set(piece.id, piece);
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

    // select as source cell if it has a piece
    if (piece && piece.owner  == state.player ){
      // remove previous selections
      if (this.selectedSrcCell){
        this.clearHighlights();
      }
      this.selectedSrcCell = boardPos;
      piece.outline();

      //highlight possible moves
      let movesPossible = this.getValidMoves(piece);
      for (let move of movesPossible){
        move.destPos.tile.highlight();
      }
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
    // return the position of the board cell at the given row and column
    return vec((col * TILE_SIZE) - this.halfWidth + TILE_SIZE / 2,
     (row * TILE_SIZE) - this.halfHeight + TILE_SIZE / 2);
  }

  getBoardCellOf(boardObject: Piece | BoardTile){
    return this.grid[boardObject.row][boardObject.col];
  }

  inBounds(row:number, col:number){
    return (row < 0 || row > this.dimension.y - 1 || col < 0 || col > this.dimension.x - 1)
  }

  getBoardCellAt(row: number, col: number){
    // return null if the row or col is out of bounds
    if (this.inBounds(row, col)){
      return null;
    }

    return this.grid[row][col];
  }

  resetSelections(){
    this.clearHighlights();
    this.selectedSrcCell = null;
    this.selectedDestCell = null;
  }
  
  clearHighlights(){
    for (let row of this.grid){
      for (let cell of row){
        if (cell.tile){
          cell.tile.unhighlight()
        }
        if (cell.piece){
          cell.piece.unoutline();
        }
      }
    }
    // if (this.selectedSrcCell.piece){
    //   this.selectedSrcCell.piece.unoutline()
    // }
    // if (this.selectedDestCell.piece){
    //   this.selectedDestCell.piece.unoutline()
    // }
    // this.selectedDestCell.tile.unhighlight()
  }


  getEquivalentMove(src:BoardCell, dest:BoardCell) {
    let validMoves = this.getValidMoves(src.piece);
    return validMoves.find((validMove) => validMove.equal(new Move(src, dest)));
  }




  getValidMoves(piece: Piece){

    let moves: Move[] = [];
    let forward = piece.forward;
    let srcPos = this.getBoardCellOf(piece);

    let forwardLeft = this.getBoardCellAt(piece.row + forward, piece.col - 1);
    let forwardRight = this.getBoardCellAt(piece.row + forward, piece.col + 1);

    if (forwardLeft) {
      if (!forwardLeft.piece){
        moves.push(new Move(srcPos, forwardLeft));
      }else {
        if (forwardLeft.piece.owner !== piece.owner){
          let forwardLeftJump = this.getBoardCellAt(piece.row + forward * 2, piece.col - 2);
          if (forwardLeftJump && !forwardLeftJump.piece){
            moves.push(new CaptureMove(srcPos, forwardLeftJump, forwardLeft));
          }
        }
      }
    }

    if (forwardRight){
      if (!forwardRight.piece){
        moves.push(new Move(srcPos, forwardRight));
      }else {
        if (forwardRight.piece.owner !== piece.owner){
          let forwardRightJump = this.getBoardCellAt(piece.row + forward * 2, piece.col + 2);
          if (forwardRightJump && !forwardRightJump.piece){
            moves.push(new CaptureMove(srcPos, forwardRightJump, forwardRight));
          }
        }
      }
    }
    return moves;

  }


  getAllValidMoves(player: Player){
    let moves: Move[] = [];
    let pieceIdArray = player.ownedPieces;
    pieceIdArray.forEach((pieceId) => {
      let piece = this.pieces.get(pieceId);
      let validMoves = this.getValidMoves(piece);
      moves.push(...validMoves);
    });
    return moves;
  }


  removePieceFromBoard(o : Piece | BoardCell){
    let cell : BoardCell;
    let piece: Piece;
    if (o instanceof BoardCell){
      cell = o;
      piece = cell.piece;
    } else if (o instanceof Piece){
      // get board cell
      cell = this.grid[o.row][o.col]
      piece = o;
    }
    this.pieces.delete(piece.id);
    piece.owner.remove(piece);
    cell.removePieceFromCell();

  }


}
