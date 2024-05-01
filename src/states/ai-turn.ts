import {GameState} from "@/components/game-state";
import type {Engine} from "excalibur";
import type {Board} from "@/actors/board/board";
import {state} from "@/store/store";
import type {AiPlayer} from "@/actors/ai/ai-player";
import type Move from "@/components/move";
import {PlayerMoving} from "@/states/player-moving";
import {millisecondsToMinutesSeconds} from "@/components/helpers";
import {GameOver} from "@/states/game-over";
import {SwitchingTurn} from "@/states/switching-turn";


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
    const aiPlayer :  AiPlayer  = board.currentPlayer as AiPlayer;
    engine.add(aiPlayer.timer);
    aiPlayer.timer.start()

    // use promise to simulate a delay in move aka bot is thinking hehe
    new Promise<Move>((resolve) => {
      setTimeout(() => {
        // aiPlayer.takeTurn();
        resolve(aiPlayer.getBestMove());
      }, 1000);
    }).then((move: Move) => {
      if (board.isOver() || !move){
        this.nextState = GameOver.stateName;
        return;
      }else {
        board.selectedMove = move;
        board.selectedSrcCell = move.srcPos;
        board.selectedDestCell = move.destPos;
        this.nextState = PlayerMoving.stateName;
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
    const board : Board = state.boardManager.currentBoard;
    const aiPlayer:  AiPlayer  = board.currentPlayer as AiPlayer;
    engine.remove(aiPlayer.timer);
    aiPlayer.timer.pause()
  }


  onUpdate(_engine: Engine, _delta: number) {
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