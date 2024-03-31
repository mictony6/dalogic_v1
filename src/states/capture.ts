import {GameState} from "@/components/game-state";
import { state} from "@/store/store";
import {Engine, Vector} from "excalibur";
import {SwitchingTurn} from "@/states/switching-turn";
import {Board} from "@/actors/board/board";
import { CaptureMove } from "@/components/capture-move";

export class Capture extends GameState{
  static stateName = "capture";
  private modalClosed: boolean = false;
  private answeredCorrect:boolean = false;

  constructor() {
    super();
    this.stateName = Capture.stateName;

    addEventListener("answer" , (e : CustomEvent) => {
      let board : Board = state.boardManager.currentBoard;
      let captureMove: CaptureMove = board.selectedMove as CaptureMove;

      console.log(e.detail, captureMove.points.toString(2));
      this.answeredCorrect = (parseInt(e.detail, 2) === captureMove.points);
      this.modalClosed = true;
     })
  }


  onEnter() {
    this.modalClosed = false;
    this.answeredCorrect = false;

    let modal = this.getModalElement();
    let textInput = this.getAnswerInputElement();
    let submit = this.getSubmitButtonElement();

    if (state.currentPlayerID !== state.player["playerID"]){
      textInput.readOnly = true;
      submit.disabled = true;
    }else{
      textInput.readOnly = false;
      submit.disabled = false;
    }
  
    if (modal && textInput) {
        modal.showModal();
        textInput.value = "";
      } else {
        console.error("Modal or input element not found");
      }

  }


  onUpdate(engine:Engine, delta:number) {
    // pause the game until the user answers the question
    if (!this.modalClosed){
      return;
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
        board.selectedMove.commit(this.answeredCorrect);
      }
      movingPiece.z = 1;
      movingPiece.vel = Vector.Zero;
      movingPiece.pos = Vector.Zero;
      board.resetSelections();
      this.nextState =  SwitchingTurn.stateName;
    }else{
        movingPiece.z = 9;
      // move the piece towards the destination tile
      movingPiece.pos = movingPiece.pos.add(destPos.sub(piecePos).normalize().scale(300 * delta/1000));

    }
  }

  getModalElement() {
    return document.getElementById("dialog") as HTMLDialogElement;
  }
  
  getAnswerInputElement() {
    return document.getElementsByClassName("answer-input")[0] as HTMLInputElement;
  }

  getSubmitButtonElement() {
    return document.getElementsByClassName("answer-button")[0] as HTMLButtonElement;
  }

}