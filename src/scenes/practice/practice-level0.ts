import {Engine, Scene, Color, Actor, vec} from "excalibur";
import {Board} from "@/actors/board/board";
import {Resources} from "@/resources";
import {state} from "@/store/store";
import {MinimaxAi} from "@/actors/ai/minimax-ai";
import {UiManager} from "@/ui/ui-manager";
import {Player} from "@/actors/player/player";

export class PracticeLevel0 extends Scene {
  private board : Board;
  private backgroundImage : Actor;
  
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
    state.player = new Player(-1, "random1");
    state.opponent = new MinimaxAi(1, "random2");
    state.firstMoveID = state.player["playerID"];
    state.currentPlayerID = state.opponent["playerID"];



    // Board
    this.board = new Board()
    this.add(this.board)
    state.boardManager.currentBoard = this.board;


    UiManager.displayScoreLabels();


      // Set the initial state
    state.stateMachine.changeState("switchingTurn");

  }

  onPostUpdate(engine: Engine, delta: number) {
    state.stateMachine.updateStateMachine(engine, delta);
  }


}