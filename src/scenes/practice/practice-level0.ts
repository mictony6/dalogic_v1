import { Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {Board} from "@/actors/board/board";
import {Resources} from "@/resources";
import {state} from "@/store/store";
import {Player} from "@/actors/player/player";
import {ExpectimaxAi} from "@/actors/ai/expectimax-ai";
import {UiManager} from "@/ui/ui-manager";
import type {GameStateMachine} from "@/components/game-state-machine";


export class PracticeLevel0 extends Scene {
  private board : Board;
  private backgroundImage : Actor;
  private ui = document.getElementById('ui');
  
  public onInitialize(engine: Engine) {

    // Background
    this.backgroundColor = Color.Black;
    this.backgroundImage = new Actor({width:Resources.GameBoardBg.width, height:Resources.BackGround3.height})
    this.backgroundImage.graphics.use(Resources.GameBoardBg.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);

    //initialize players
    //im just using a random number generator here
    state.player = new Player(-1, "practice"+Math.random());
    state.opponent = new ExpectimaxAi(1, "random2");
    state.firstMoveID = state.player["playerID"];
    state.currentPlayerID = state.opponent["playerID"];


    // Board
    this.board = new Board()
    this.add(this.board)
    state.boardManager.currentBoard = this.board;


    // these labels update thru the power of event listener hehe
    UiManager.displayScoreLabels();
    UiManager.displayTimer();



    // Set the initial state
    let stateMachine : GameStateMachine = state.stateMachine
    stateMachine.changeState("switchingTurn",engine);

  }

  onActivate(_context: SceneActivationContext<unknown>): void {
          
    this.ui.classList.add('PracticeLevel')
    this.ui.appendChild(UiManager.createModal().dialog);

  }

  onPostUpdate(engine: Engine, delta: number) {
    state.stateMachine.updateStateMachine(engine, delta);
  }


}