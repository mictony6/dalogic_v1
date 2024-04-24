import type {Engine} from "excalibur";


export abstract class GameState {
  active : boolean = false
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