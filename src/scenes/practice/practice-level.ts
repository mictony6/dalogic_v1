import { Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {Board} from "@/actors/board/board";
import {Resources} from "@/resources";
import {GameMode, sceneManager, state} from "@/store/store";
import {Player} from "@/actors/player/player";
import {ExpectimaxAi} from "@/actors/ai/expectimax-ai";
import {UiManager} from "@/ui/ui-manager";
import type {GameStateMachine} from "@/components/game-state-machine";
import {SwitchingTurn} from "@/states/switching-turn";
import {CompositePlayer} from "@/actors/ai/composite-player";
import {RandomAi} from "@/actors/ai/random-ai";
import {AlphaBetaAi} from "@/actors/ai/alpha-beta-ai";



export class PracticeLevel extends Scene {
  private board : Board;
  private backgroundImage : Actor;
  private ui = document.getElementById('ui');
  private pauseMenu: HTMLDialogElement;
  private level: number;
  
  public onInitialize(engine: Engine) {

    // Background
    this.backgroundColor = Color.Black;
    this.backgroundImage = new Actor({width:Resources.GameBoardBg.width, height:Resources.BackGround3.height})
    this.backgroundImage.graphics.use(Resources.GameBoardBg.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);




  }

  onActivate(context: SceneActivationContext<unknown>): void {
    this.level = context.data["level"] + 1; // dynamic levels
    console.log(`Level ${this.level}`);
    state.gameMode = GameMode.AIVsPlayer;
          
    this.ui.classList.add('PracticeLevel')

    // answer prompt
    this.ui.appendChild(UiManager.createModal().dialog);

    // pause menu
    this.pauseMenu = document.createElement('dialog');
    this.pauseMenu.id = "pauseMenu";
    this.pauseMenu.className = "dialog";
    this.pauseMenu.innerHTML = `
    <h2 class="dialog-title">Game Paused</h2> 
    <div class="dialog-content">
      <button type="button" id="retryButton">Retry Level</button>
      <button type="button" id="exitButton">Exit to Main Menu</button>
      <button type="submit" class="close">Resume</button>
    </div>
  `;
    this.ui.appendChild(this.pauseMenu);

    addEventListener("keydown", this.onPause);

    // Get the buttons
    const retryButton = document.getElementById("retryButton");
    const exitButton = document.getElementById("exitButton");
    const closeButton = this.pauseMenu.getElementsByClassName("close")[0] as HTMLButtonElement;

    retryButton.onclick = this.onRetryButtonClick.bind(this);
    exitButton.onclick = this.onExitButtonClick.bind(this);
    closeButton.onclick = () => this.pauseMenu.close();
    this.pauseMenu.onclose = () => state.isPaused = false;


    //initialize players
    //im just using a random number generator here
    state.player = new Player(-1, "practice"+Math.random());

    // level 1-5 is a mix of random to expectimax
    // level 6-10 from expecti to minimax with alpha beta
    if(this.level < 5){
      state.opponent = new CompositePlayer(1, "random2", {
        players: [new RandomAi(1, "random3"), new ExpectimaxAi(1, "random4")],
        weights: [10-this.level, this.level]
      });
    } else {
      state.opponent = new CompositePlayer(1, "random2", {
        players: [new ExpectimaxAi(1, "random3"), new AlphaBetaAi(1, "random4")],
        weights: [10-this.level, this.level]
      });
    }
    state.firstMoveID = state.player["playerID"];
    state.currentPlayerID = state.opponent["playerID"];

    // Board
    this.board = new Board()
    this.add(this.board)
    state.boardManager.currentBoard = this.board;


    // these labels update thru the power of event listener hehe
    UiManager.displayScoreLabels();
    UiManager.displayTimer();

    const stateMachine : GameStateMachine = state.stateMachine;
    stateMachine.changeState(SwitchingTurn.stateName, this.engine);


  }

  onDeactivate(context: SceneActivationContext) {
    removeEventListener("keydown", this.onPause);
    state.isPaused = true;
    this.ui.classList.remove('PracticeLevel')
    this.ui.innerHTML = ''
    this.remove(this.board)
    this.board.kill();
  }

  onPostUpdate(engine: Engine, delta: number) {
    state.stateMachine.updateStateMachine(engine, delta);
  }

  onPause(e:KeyboardEvent){
    // NOTE: T.T i fucking hate this, i thot i was doing something wrong
    // i realized pressing a key triggers the default button behaviour
    // lesson learned, always call preventDefault method when overriding button behaviour
    if (e.code == "Escape"){
      e.preventDefault();
      this.pauseMenu.showModal();
      state.isPaused = true;
    }
  }

  onRetryButtonClick() {
    this.pauseMenu.close()
    sceneManager.push("practice", {level: this.level-1});
  }

  onExitButtonClick() {
    this.pauseMenu.close()
    sceneManager.push("mainMenu");
  }


}