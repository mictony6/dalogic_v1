import {GameState} from "@/components/game-state";
import { state } from "@/store/store";
import {Engine} from "excalibur";

export class GameOver extends GameState{
  static stateName = "gameOver";

  constructor() {
    super();
    this.stateName = GameOver.stateName;
  }

  onEnter(engine: Engine){
    console.log("Game Over")
    engine.goToScene("game-over", {gameMode: state.gameMode});
  }

}