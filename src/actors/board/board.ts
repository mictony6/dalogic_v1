import type {Engine, Scene, Vector} from "excalibur";
import type {Player} from "@/actors/player/player";
import {Actor, Color,  vec, } from 'excalibur';
import {BoardTile} from "@/actors/tile/tile";
import {Piece} from "@/actors/piece/piece";
import BoardCell from "@/components/board-cell";
import Move from "@/components/move";
import {state} from "@/store/store";
import {CaptureMove} from "@/components/capture-move";
const TILE_SIZE = state.TILE_SIZE;


export class Board extends Actor {
  readonly dimension : Vector = vec(8,8)
  readonly halfSize : Vector;
  selectedSrcCell : BoardCell;
  selectedDestCell : BoardCell;
  selectedMove: Move | CaptureMove;
  grid : BoardCell[][] = [];
  // piece hash map
  pieces = new Map<number, Piece>();
  isGameOver = false;

  constructor(public boardConfig: Array<any> = []) {
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

    this.createBoard();

    console.log(this.grid)

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
          let owner = row > 3 ? state.player : state.opponent
          // add the piece id to the player's owned pieces array

          let pieceVal= null;
          if (this.boardConfig.length > 0){
            pieceVal = this.boardConfig[row][col];
          }
          
          piece = new Piece(row, col, owner, pieceVal);
          piece.addTag(`piece:r${row}c${col}`);
  

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


    // if not your turn
    let player : Player = state.player;
    if (player.playerID !== state.currentPlayerID){
      return;
    }


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

  addPieceToBoard(piece:Piece){
    this.pieces.set(piece.id, piece);
    piece.owner.owns(piece);
    let cell = this.grid[piece.row][piece.col]
    if (!cell){throw new Error("Cant add a piece which doesnt have a row and column initialized")}
    cell.addPieceToCell(piece);

  }


  evaluate(currentPlayer:Player) {
    let opponent: Player = currentPlayer.playerID === state.player["playerID"] ? state.opponent : state.player;
    let p1WeightedPieceScore : number;
    let p2WeightedPieceScore : number
    ;



    currentPlayer.ownedPieces.forEach(pieceId => {
      let piece = this.pieces.get(pieceId);
      let pieceWeight = piece.value;
      p1WeightedPieceScore += pieceWeight;
    })

    opponent.ownedPieces.forEach(pieceId => {
      let piece = this.pieces.get(pieceId);
      let pieceWeight = piece.value;
      p2WeightedPieceScore += pieceWeight;
    })


    return currentPlayer.score - opponent.score + (p1WeightedPieceScore-p2WeightedPieceScore);
  }


  // get player whos turn it is
  get currentPlayer() : Player{
    return state.currentPlayerID === state.player.playerID ? state.player : state.opponent;
  }

  isOver() {
    return (
      this.isGameOver ||
      this.getAllValidMoves(state.player).length === 0 ||
      this.getAllValidMoves(state.opponent).length === 0
    );
  }


}
