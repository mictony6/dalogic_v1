import type {GameState} from "@/components/game-state";
import {PlayerTurn} from "@/states/player-turn";
import {PlayerMoving} from "@/states/player-moving";
import {AiTurn} from "@/states/ai-turn";
import {SwitchingTurn} from "@/states/switching-turn";
import {GameOver} from "@/states/game-over";
import {Capture} from "@/states/capture";
import type {Engine} from "excalibur";


export class GameStateMachine {
  private states: Map<string, GameState> = new Map<string, GameState>();
  private currentState: GameState;
  private previousState: any;


  constructor() {
    this.addState(new PlayerTurn());
    this.addState(new PlayerMoving());
    this.addState(new AiTurn());
    this.addState(new SwitchingTurn());
    this.addState(new GameOver());
    this.addState(new Capture());

    addEventListener("switchstate", (e:CustomEvent) => {
      this.currentState.nextState = e.detail;
    })

  }

  public addState( state: GameState) {
    this.states.set(state.stateName, state);
  }


  public changeState(name: string, engine: Engine) {
    if (this.states.has(name)) {
      if (this.currentState) {
        this.currentState.nextState = null;
        this.currentState.onExit(engine);
        this.previousState = this.currentState;
      }

      this.currentState = this.states.get(name);
      this.currentState.onEnter(engine);
    }
  }

  // public revertToPreviousState() {
  //   this.changeState(this.previousState, );
  // }


  updateStateMachine(engine: Engine, delta: number) {
    if (!this.currentState) {

      return;
    }


    
    this.currentState.onUpdate( engine, delta);

    if (this.currentState.nextState != null) {
      this.changeState(this.currentState.nextState, engine);
    }
  }


}
