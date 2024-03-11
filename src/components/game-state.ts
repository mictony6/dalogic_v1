import {Engine, Entity} from "excalibur";

export abstract class GameState {
  static stateName:string = "default";
  stateName:string = "default";
  nextState:string;

  onUpdate(engine:Engine, delta:number){
    // override this
  }


  onEnter(engine:Engine) {
    // override this

  }

  onExit(engine:Engine) {
    // override this

  }
}