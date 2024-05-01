import {GameState} from "@/components/game-state";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import type {CaptureMove} from "@/components/capture-move";
import {type Engine, Vector} from "excalibur";
import {CheckDoubleCapture} from "@/states/check-double-capture";
import {AudioType, GameAudio} from "@/audio/GameAudio";
import { SwitchingTurn } from "./switching-turn";
import Swal from "sweetalert2";

export class Capture extends GameState{
  static stateName = "capture";
  private modalClosed: boolean = false;
  private answeredCorrect:boolean = false;

  constructor() {
    super();
    this.stateName = Capture.stateName;

    addEventListener("answer" , (e : CustomEvent) => {
      const board : Board = state.boardManager.currentBoard;
      const captureMove: CaptureMove = board.selectedMove as CaptureMove;

      console.log(e.detail, captureMove.points.toString(2));
      this.answeredCorrect = (parseInt(e.detail, 2) === captureMove.points);
      if (this.answeredCorrect){
        new GameAudio().play(AudioType.SCORE);
        if (state.currentPlayerID === state.player["playerID"]){
          Swal.fire({
            title: 'Correct!',
            icon: 'success',
            confirmButtonText: `+${captureMove.points} points!`,
            toast: true,
            timer: 2000,
            customClass:{
              title: 'alert-title',
              confirmButton: 'alert-button'
            }
          })
        } else {
          Swal.fire({
            title: 'Opponent Correct!',
            icon: "info",
            toast: true,
            timer: 2000,
            customClass:{
              title: 'alert-title',
            }
          })
        }
      } else {
        new GameAudio().play(AudioType.ERROR);
        if (state.currentPlayerID === state.player["playerID"]){
          Swal.fire({
            title: 'Ooops!',
            icon: 'error',
            confirmButtonText: `You lost ${captureMove.points} points to opponent!`,
            toast: true,
            timer: 2000,
            customClass:{
              title: 'alert-title-error',
              confirmButton: 'alert-button-error'
            }
          })
        } else {
          Swal.fire({
            title: 'Nice! Opponent Wrong.',
            icon: 'info',
            confirmButtonText: `+${captureMove.points} points to you!`,
            toast: true,
            timer: 2000,
            customClass:{
              title: 'alert-title-error',
              confirmButton: 'alert-button-error'
            }
          });
        }
      }
      this.modalClosed = true;
     });

  }


  onEnter() {
    this.modalClosed = false;
    this.answeredCorrect = false;

    const board = state.boardManager.currentBoard;
    const modal = this.getModalElement();

    const captureMove : CaptureMove = board.selectedMove as CaptureMove;
    const a = captureMove.srcPos.piece.binRep;
    const b = captureMove.mid.piece.binRep;

    const modalHeading = document.getElementById("equation")
    modalHeading.innerText = `${a} ${captureMove.operationName} ${b}`;

    const textInput = this.getAnswerInputElement();
    const submit = this.getSubmitButtonElement();

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


    const board : Board = state.boardManager.currentBoard;
    if (!board.selectedMove){
      throw new Error("No move selected");
    }

    const movingPiece = board.selectedMove.srcPos.piece;
    const destTile = board.selectedMove.destPos.tile;

    const destPos : Vector = destTile.getGlobalPos();
    const piecePos : Vector = movingPiece.getGlobalPos();
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
      if (board.selectedMove.destPos.tile.row > 0 &&  board.selectedMove.destPos.tile.row < 7){
        this.nextState = CheckDoubleCapture.stateName;
      } else{
        this.nextState = SwitchingTurn.stateName; 
      }
    }else{
      movingPiece.z = 9;
      // move the piece towards the destination tile
      movingPiece.vel = movingPiece.pos.add(destPos.sub(piecePos).normalize().scale(300 ));

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