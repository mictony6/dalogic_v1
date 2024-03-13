import {GameState} from "@/components/game-state";
import { state} from "@/store/store";
import {Engine, Vector} from "excalibur";
import {SwitchingTurn} from "@/states/switching-turn";
import {Board} from "@/actors/board/board";
import { CaptureMove } from "@/components/capture-move";

export class Capture extends GameState{
  static stateName = "capture";
  private answered: boolean = false;
  private correct:boolean = false;

  constructor() {
    super();
    this.stateName = Capture.stateName;

    addEventListener("answer" , (e : CustomEvent) => {
        let board : Board = state.boardManager.currentBoard;
        let captureMove: CaptureMove = board.selectedMove as CaptureMove;
        console.log(e.detail, captureMove.points.toString(2));
        
        this.correct = (parseInt(e.detail, 2) === captureMove.points);
        this.answered = true;
     })
  }


  onEnter() {
    this.answered = false;
    this.correct = false;


    console.log("Your are capturing a piece");
    
    let modal = document.getElementById("dialog") as HTMLDialogElement;
    modal.showModal();
    let textInput = document.getElementsByClassName("answer-input")[0] as HTMLInputElement;
    textInput.value = "";

  }


  onUpdate(engine:Engine, delta:number) {
    // pause the game until the user answers the question
    if (!this.answered){
      return;
    }

    // check if the user answered correctly
    if (this.correct){
        console.log("Correct answer");
        
    }else{
        console.log("Incorrect answer");
    }


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