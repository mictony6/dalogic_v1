import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import type {AiPlayer} from "@/actors/ai/ai-player";
import {GameOver} from "@/states/game-over";
import {SwitchingTurn} from "@/states/switching-turn";

function millisecondsToMinutesSeconds(milliseconds) {
  // Calculate number of minutes (discarding decimals)
  const minutes = Math.floor(milliseconds / (1000 * 60));

  // Calculate remaining seconds (use modulo to get remainder after seconds conversion)
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  // Format output with leading zeros for minutes and seconds if needed
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export class AiTurn extends GameState{
  static stateName = "aiTurn";
  private timeLeft: string ;
  private lastTimeLeft: string ;

  constructor() {
    super();
    this.stateName = AiTurn.stateName;
  }


  onEnter(engine:Engine) {
    console.log("AI turn ");


    const board : Board = state.boardManager.currentBoard;
    // generate move here from AI
    const aiPlayer:  AiPlayer  = state.currentPlayerID === state.opponent["playerID"] ? state.opponent : state.player;

    engine.add(aiPlayer.timer);
    aiPlayer.timer.start()

    // use promise to simulate a delay in move aka bot is thinking hehe
    new Promise<void>((resolve) => {
      setTimeout(() => {
        aiPlayer.takeTurn();
        resolve();
      }, 1000);
    }).then(() => {
      if (board.isGameOver){
        this.nextState = GameOver.stateName;
      }else {
        this.nextState = SwitchingTurn.stateName;
      }
    })

    // aiPlayer.takeTurn();
    // if (board.isGameOver){
    //   this.nextState = GameOver.stateName;
    // }else {
    //
    //   this.nextState = SwitchingTurn.stateName;
    // }

  }


  onExit(engine:Engine) {
    console.log("End of AI turn");
    const aiPlayer:  AiPlayer  = state.currentPlayerID === state.opponent["playerID"] ? state.opponent : state.player;
    engine.remove(aiPlayer.timer);
    aiPlayer.timer.pause()
  }


  onUpdate(engine: Engine, delta: number) {
    const board : Board = state.boardManager.currentBoard;


    const currentTimeLeft  = millisecondsToMinutesSeconds(board.currentPlayer.timer.timeToNextAction);
    // only update timeleft if it changed in whole numbers
    if (this.lastTimeLeft !== currentTimeLeft){
      this.timeLeft = currentTimeLeft;
      dispatchEvent(new CustomEvent("turntimer-tick", {detail:this.timeLeft}));
    }

    if (state.currentPlayerID !== state.player["playerID"]){
      return
    }
  }


}