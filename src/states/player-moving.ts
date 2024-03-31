import {GameState} from "@/components/game-state";
import { state} from "@/store/store";
import {Engine, Vector} from "excalibur";
import {SwitchingTurn} from "@/states/switching-turn";
import {Board} from "@/actors/board/board";
import { CaptureMove } from "@/components/capture-move";
import { Capture } from "./capture";

export class PlayerMoving extends GameState{
  static stateName = "playerMoving";

  constructor() {
    super();
    this.stateName = PlayerMoving.stateName;
  }


  onEnter() {
    console.log("Your are moving a piece");

  }

  onUpdate(engine:Engine, delta:number) {
    let board : Board = state.boardManager.currentBoard;
    if (!board.selectedMove){
      throw new Error("No move selected");
    }

    if (board.selectedMove instanceof CaptureMove){
      this.nextState = Capture.stateName;
      return;
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

      // reset the piece's velocity and position
      movingPiece.vel = Vector.Zero;
      movingPiece.pos = Vector.Zero;
      // reset the board's selections
      board.resetSelections();
      this.nextState =  SwitchingTurn.stateName;
    }else{

      // move the piece towards the destination tile
      movingPiece.pos = movingPiece.pos.add(destPos.sub(piecePos).normalize().scale(300 * delta/1000));

    }
  }

}