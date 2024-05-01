import {Entity, Timer} from "excalibur";
import {GameOver} from "@/states/game-over";
import type {Piece} from "@/actors/piece/piece";

export class Player extends Entity {
  forward: number = 1;
  public ownedPieces= []
  public playerID:string= "0"
  score: number = 0;
  timer: Timer = new Timer({
    interval: 600000, // 10 minutes,
    fcn : this.onGameOver,
  });

  constructor(forward: number, id:string) {
    super();
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

  kill(): void {
    this.timer.stop();
    this.timer.off(this.onGameOver);
    super.kill()
  }

  onGameOver(){
    console.log("Time's up")
    // end the game
    dispatchEvent(new CustomEvent("switchstate", {detail: GameOver.stateName}));

  }

  


}
