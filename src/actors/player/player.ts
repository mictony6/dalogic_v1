import {Timer} from "excalibur";
import {GameOver} from "@/states/game-over";
import type {Piece} from "@/actors/piece/piece";

export class Player  {
  forward: number = 1;
  public ownedPieces= []
  public playerID:string= "0"
  score: number = 0;
  timer: Timer = new Timer({
    interval: 10000, // 10 minutes
    fcn: () => {
      console.log("Time's up")
      // end the game
      dispatchEvent(new CustomEvent("switchstate", {detail: GameOver.stateName}));

    }
  });

  constructor(forward: number, id:string) {
    this.forward = forward;
    this.playerID = id;
  }
  owns(piece: Piece){
    this.ownedPieces.push(piece.id)
  }

  remove(piece: Piece){
    this.ownedPieces = this.ownedPieces.filter(p => p !== piece.id)
  }

  addScore(n:number){
    this.score+=n;
  }


}
