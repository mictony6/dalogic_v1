import {Engine, Entity} from "excalibur";

export abstract class GameState {
  static stateName:string = "default";
  stateName:string = "default";
  nextState:string;

  onUpdate(engine:Engine, delta:number){
    // override this
  }


  onEnter() {
    // override this

  }

  onExit() {
    // override this

  }
}