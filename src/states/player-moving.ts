import {GameState} from "@/components/game-state";
import {GameMode, state} from "@/store/store";
import Move from "@/components/move";
import {Engine, Vector} from "excalibur";

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
    let board = state.boardManager.currentBoard;
    if (!board.selectedMove){
      throw new Error("No move selected");
    }

    let movingPiece = board.selectedMove.srcPos.piece;
    let destTile = board.selectedMove.destPos.tile;

    if (movingPiece.getGlobalPos().squareDistance(destTile.getGlobalPos()) <= 50){
      // if the piece is close enough to the destination tile, move it there
      if (destTile.children.length > 0){
        throw new Error("Tile already has a piece");
      } else {
        board.selectedMove.finalize()
      }
      movingPiece.vel = Vector.Zero;
      movingPiece.pos = Vector.Zero;
      board.resetSelections();

      if (state.gameMode === GameMode.AIVsPlayer){
        this.nextState = "aiTurn"
      }else {
        this.nextState = "playerTurn";
      }
    }else{

      // move the piece towards the destination tile
      // movingPiece.vel = (destTile.getGlobalPos().sub(movingPiece.getGlobalPos()).normalize().scale(300));
      movingPiece.pos = movingPiece.pos.add(destTile.getGlobalPos().sub(movingPiece.getGlobalPos()).normalize().scale(300 * delta/1000));

    }
  }

}