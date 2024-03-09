import {GameState} from "@/components/game-state";
import {GameMode, state} from "@/store/store";
import {Engine} from "excalibur";
import {AiPlayer} from "@/actors/ai/ai-player";
import {Player} from "@/actors/player/player";
import {PlayerTurn} from "@/states/player-turn";
import {AiTurn} from "@/states/ai-turn";

export class SwitchingTurn extends GameState{
  static stateName = "switchingTurn";

  constructor() {
    super();
    this.stateName = SwitchingTurn.stateName;
  }


  onEnter() {
    console.log("Switching turn ");
  }

  onExit() {
    console.log("done switching turn");
  }

  onUpdate(engine:Engine, delta:number) {
    let players = [state.player, state.opponent];

    let prevPlayer : Player = players.find((p:Player) => p.playerID === state.currentPlayerID )
    let nextPlayer : Player = players.find((p:Player) => p.playerID !== state.currentPlayerID )

    state.currentPlayerID = nextPlayer.playerID;

    switch (state.gameMode){
      case GameMode.AIVsPlayer:
        if (prevPlayer instanceof AiPlayer){
          this.nextState = PlayerTurn.stateName;
        }else {
          this.nextState = AiTurn.stateName;
        }
        break;
      case GameMode.AIvsAI:
        this.nextState = AiTurn.stateName;
        break;
    }

  }

}