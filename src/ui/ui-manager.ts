import {Board} from "@/actors/board/board";
import {Player} from "@/actors/player/player";
import {GameMode, sceneManager, state} from "@/store/store";
import {Color, Font, Label, TextAlign} from "excalibur";
import {AudioType, GameAudio} from "@/audio/GameAudio";

export class UiManager {


  static displayTimer() {
    const board : Board = state.boardManager.currentBoard;
    const label = new Label({
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
    return new Label({
      text: player.score.toString(),
      font: new Font({
        family: 'Upheaval',
        bold: true,
        textAlign: TextAlign.Center,
        size: 40,
        color: Color.Blue
      })
    });
  }

  static displayScoreLabels(){
    const board = state.boardManager.currentBoard
    // place score labels
    const p1Label = UiManager.createScoreLabel(state.player);
    p1Label.z = 1;
    board.addChild(p1Label);


    addEventListener("score2", (e : CustomEvent) =>{
      p1Label.text = e.detail;
    })

    const p2Label  = UiManager.createScoreLabel(state.opponent);
    p2Label.z = 1;
    
    board.addChild(p2Label);

    p1Label.pos.x = 460;
    p1Label.pos.y = -40;
    p1Label.rotation = -0.1;

    p2Label.pos.x = 475;
    p2Label.pos.y = 215;
    p2Label.rotation = 0.2;


    addEventListener("score1", (e : CustomEvent) =>{
      p2Label.text = e.detail;
    })
  }

  static createLevelButton(text:string) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'level-button'
    btn.onclick = (e) => {
      e.preventDefault()
      // sceneManager.push(scene)
      sceneManager.push('practice', {level: parseInt(text)})
      new GameAudio().play(AudioType.SELECT);

    }
    return btn
  }


  static createMainMenuButton(text:string, scene:string) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'main-menu-button'
    btn.onclick = (e) => {
      e.preventDefault()
      sceneManager.push(scene)
      new GameAudio().play(AudioType.SELECT);


    }
    return btn
  }


  static createModal(){
    const dialog = document.createElement('dialog');
    dialog.id = "dialog";
    dialog.className = "dialog";

    const heading = document.createElement('h2');
    heading.className = "dialog-title"; // Optional class for styling
    heading.innerText = "Enter your answer"; // Change this to your desired text

    const equation = document.createElement("div");
    equation.id = "equation";
    equation.innerText = "_____"

    const content = document.createElement('div');
    content.className = "dialog-content";

    const form = document.createElement('form');
    form.className = "dialog-form";

    const textInput = document.createElement('input');
    textInput.className = "answer-input";
    textInput.type = "text";

    const submit = document.createElement('button');
    submit.className = "answer-button";
    submit.type = "submit";
    submit.innerText = "Check Answer";
    submit.onclick = (e) => {
      e.preventDefault();
      dialog.close();
      // for me
      const event = new CustomEvent("answer", {detail: textInput.value});
      dispatchEvent(event);
      // for opponent
      if (GameMode.PlayerVsPlayer){
        dispatchEvent(new CustomEvent("answer-submitted", {detail: textInput.value}));
      }
    }

    form.appendChild(textInput);
    form.appendChild(submit);
    content.appendChild(equation);
    content.appendChild(form);
    dialog.appendChild(heading);
    dialog.appendChild(content);
    return {dialog, submit, textInput};

  }
}