import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import {sceneManager, state} from "@/store/store";


export class GameOver extends GameState{
  static stateName = "gameOver";

  constructor() {
    super();
    this.stateName = GameOver.stateName;
  }

  onEnter(engine: Engine){

    state.boardManager.currentBoard.kill();
    engine.removeTimer(state.player.timer);
    engine.removeTimer(state.opponent.timer);
    state.player.kill()
    state.opponent.kill()

   
    sceneManager.push("gameOverScreen",{gameMode: state.gameMode, yourScore: state.player.score, opponentScore:state.opponent.score} )

  }
}