import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import {Color, Font, Label, TextAlign} from "excalibur";
import {sceneManager, state} from "@/store/store";


export class GameOver extends GameState{
  static stateName = "gameOver";

  constructor() {
    super();
    this.stateName = GameOver.stateName;
  }

  onEnter(engine: Engine){
    sceneManager.push("gameOverScreen",{gameMode: state.gameMode} )

  }
}