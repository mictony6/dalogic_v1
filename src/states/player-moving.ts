import {GameState} from "@/components/game-state";
import {Engine, Vector} from "excalibur";
import type {Board} from "@/actors/board/board";
import { state} from "@/store/store";
import {CaptureMove} from "@/components/capture-move";
import {Capture} from "@/states/capture";
import {SwitchingTurn} from "@/states/switching-turn";
import {AiPlayer} from "@/actors/ai/ai-player";
import {AudioType, GameAudio} from "@/audio/GameAudio";
import { CheckDoubleCapture } from "./check-double-capture";

export class PlayerMoving extends GameState{
  static stateName = "playerMoving";

  constructor() {
    super();
    this.stateName = PlayerMoving.stateName;
  }

  onUpdate(engine:Engine, delta:number) {
    const board : Board = state.boardManager.currentBoard;
    if (!board.selectedMove){
      throw new Error("No move selected");
    }

    if (board.selectedMove instanceof CaptureMove && !(board.currentPlayer instanceof AiPlayer)){
      this.nextState = Capture.stateName;
      return;
    }

    const movingPiece = board.selectedMove.srcPos.piece;
    const destTile = board.selectedMove.destPos.tile;

    const destPos : Vector = destTile.getGlobalPos();
    const piecePos : Vector = movingPiece.getGlobalPos();
    const sqrDist = piecePos.squareDistance(destPos); 
    if (sqrDist <= 50){
      // if the piece is close enough to the destination tile, move it there
      if (destTile.children.length > 0){
        throw new Error("Tile already has a piece");
      } else {
        if (board.currentPlayer instanceof AiPlayer && board.selectedMove instanceof CaptureMove){
          new GameAudio().play(AudioType.SCORE);
        }else {
          new GameAudio().play(AudioType.MOVE);
        }
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
      movingPiece.vel = destPos.sub(piecePos).normalize().scale(300);


    }
  }

}