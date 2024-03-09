import {GameState} from "@/components/game-state";
import { state} from "@/store/store";
import {Engine, Vector} from "excalibur";
import {SwitchingTurn} from "@/states/switching-turn";
import {Board} from "@/actors/board/board";

export class PlayerMoving extends GameState{
  static stateName = "playerMoving";

  constructor() {
    super();
    this.stateName = PlayerMoving.stateName;
  }


  onEnter() {
    console.log("Your are moving a piece");
  }

  onExit() {
    console.log("Opponent's turn");
  }

  onUpdate(engine:Engine, delta:number) {
    let board : Board = state.boardManager.currentBoard;
    if (!board.selectedMove){
      throw new Error("No move selected");
    }

    let movingPiece = board.selectedMove.srcPos.piece;
    let destTile = board.selectedMove.destPos.tile;

    let destPos : Vector = destTile.getGlobalPos();
    let piecePos : Vector = movingPiece.getGlobalPos();
    if (piecePos.squareDistance(destPos) <= 50){
      // if the piece is close enough to the destination tile, move it there
      if (destTile.children.length > 0){
        throw new Error("Tile already has a piece");
      } else {
        board.selectedMove.commit()
      }
      movingPiece.vel = Vector.Zero;
      movingPiece.pos = Vector.Zero;
      board.resetSelections();
      this.nextState =  SwitchingTurn.stateName;
    }else{

      // move the piece towards the destination tile
      movingPiece.pos = movingPiece.pos.add(destPos.sub(piecePos).normalize().scale(300 * delta/1000));

    }
  }

}