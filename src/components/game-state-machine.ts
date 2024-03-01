import {Engine, Entity} from "excalibur";
import {GameState} from "@/components/game-state";
import {PlayerTurn} from "@/states/player-turn";
import {PlayerMoving} from "@/states/player-moving";
import {AiTurn} from "@/states/ai-turn";

export class GameStateMachine {
  private states: Map<string, GameState> = new Map<string, GameState>();
  private currentState: GameState;
  private previousState: any;


  constructor() {
    this.addState(PlayerTurn.stateName, new PlayerTurn());
    this.addState(PlayerMoving.stateName, new PlayerMoving());
    this.addState(AiTurn.stateName, new AiTurn())
  }

  public addState(name: string, state: any) {
    this.states.set(name, state);
  }

  public removeState(name: string) {
    this.states.delete(name);
  }

  public changeState(name: string) {
    if (this.states.has(name)) {
      if (this.currentState) {
        this.currentState.nextState = null;
        this.currentState.onExit();
        this.previousState = this.currentState;
      }

      this.currentState = this.states.get(name);
      this.currentState.onEnter();
    }
  }

  public revertToPreviousState() {
    this.changeState(this.previousState);
  }


  updateStateMachine(engine: Engine, delta: number) {
    this.currentState.onUpdate( engine, delta);

    if (this.currentState.nextState != null) {
      this.changeState(this.currentState.nextState);
    }
  }


}
