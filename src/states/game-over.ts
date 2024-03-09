import {GameState} from "@/components/game-state";
import {Engine} from "excalibur";

export class GameOver extends GameState{
  static stateName = "gameOver";

  constructor() {
    super();
    this.stateName = GameOver.stateName;
  }

  onUpdate(engine: Engine, delta: number) {
    console.log("gameOver")
  }
}