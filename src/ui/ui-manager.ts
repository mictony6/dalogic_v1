import { Board } from "@/actors/board/board";
import {Player} from "@/actors/player/player";
import { state } from "@/store/store";
import {Color, Engine, Font, Label, TextAlign} from "excalibur";

export enum GameLabelStyle{
  LIGHT,
  MEDIUM,
  BOLD
} 
export class UiManager {

  static displayTimer() {
    let board : Board = state.boardManager.currentBoard;
    let label: Label;
    label = new Label({
      text: "0",
      font: new Font({
        family:'Upheaval',
        bold: true,
        textAlign: TextAlign.Center,
        size: 40,
        color: Color.Red
      }),
    });

    label.pos.x = -455;
    label.pos.y = -90;
    label.rotation = -0.08;

    label.z = 9;

    addEventListener("turntimer-tick", (e : CustomEvent) => {
      label.text = e.detail;
    })

    board.addChild(label);
  }


  static createScoreLabel(player: Player){
    let label: Label;
    label = new Label({
      text: player.score.toString(),
      font: new Font({
        family:'Upheaval',
        bold: true,
        textAlign: TextAlign.Center,
        size: 40,
        color: Color.Blue
      })
    });


    return label;
  }

  static displayScoreLabels(){
    let board = state.boardManager.currentBoard
    // place score labels
    let p1Label = UiManager.createScoreLabel(state.player);
    p1Label.z = 1;
    board.addChild(p1Label);


    addEventListener("score1", (e : CustomEvent) =>{
      p1Label.text = e.detail;
    })

    let p2Label  = UiManager.createScoreLabel(state.opponent);
    p2Label.z = 1;
    
    board.addChild(p2Label);

    p1Label.pos.x = 460;
    p1Label.pos.y = -40;
    p1Label.rotation = -0.1;

    p2Label.pos.x = 475;
    p2Label.pos.y = 215;
    p2Label.rotation = 0.2;

    addEventListener("score2", (e : CustomEvent) =>{
      p2Label.text = e.detail;
    })
  }

  static createLevelButton(text:string, scene:string, engine: Engine) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'level-button'
    btn.onclick = (e) => {
      e.preventDefault()
      engine.goToScene(scene)
    }
    return btn
  }


  static createMainMenuButton(text:string, scene:string, engine:Engine) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'main-menu-button'
    btn.onclick = (e) => {
      e.preventDefault()
      engine.goToScene(scene)
    }
    return btn
  }


  static createModal(){
    let dialog = document.createElement('dialog');
    dialog.id = "dialog";
    dialog.className = "dialog";

    let content = document.createElement('div');
    content.className = "dialog-content";

    let form = document.createElement('form');
    form.className = "dialog-form";

    let textInput = document.createElement('input');
    textInput.className = "answer-input";
    textInput.type = "text";
    textInput.placeholder = "enter your answer";

    let submit = document.createElement('button');
    submit.className = "answer-button";
    submit.type = "submit";
    submit.innerText = "Check Answer";
    submit.onclick = (e) => {
      e.preventDefault();
      dialog.close();
      // for me
      let event = new CustomEvent("answer", {detail: textInput.value});
      dispatchEvent(event);
      // for opponent
      dispatchEvent(new CustomEvent("answer-submitted", {detail: textInput.value}));
    }


    form.appendChild(textInput);
    form.appendChild(submit);
    content.appendChild(form);
    dialog.appendChild(content);
    return {dialog, submit, textInput};

  }
}