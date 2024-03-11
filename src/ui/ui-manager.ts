import {Player} from "@/actors/player/player";
import { state } from "@/store/store";
import {Color, Engine, Font, Label, TextAlign} from "excalibur";

export enum GameLabelStyle{
  LIGHT,
  MEDIUM,
  BOLD
} 
export class UiManager {
  static createScoreLabel(player: Player){
    let label: Label;
    label = new Label({
      text: player.score.toString(),
      font: new Font({
        family:'Upheaval',
        bold: true,
        textAlign: TextAlign.Center,
        size: 40,
        color: Color.Red
      })
    });


    return label;
  }

  static displayScoreLabels(){
    let board = state.boardManager.currentBoard
      // place score labels
      let p1Label = UiManager.createScoreLabel(state.player);
      p1Label.z = 999;
      board.addChild(p1Label);
  
  
      addEventListener("score1", (e : CustomEvent) =>{
        p1Label.text = e.detail;
      })
  
      let p2Label  = UiManager.createScoreLabel(state.opponent);
      p2Label.z = 1;
      board.addChild(p2Label);
  
  
      addEventListener("score2", (e : CustomEvent) =>{
        p2Label.text = e.detail;
      })
  
      p2Label.pos.y -= 20;
      p1Label.pos.y += 20;
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

}