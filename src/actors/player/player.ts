import {Piece} from "@/actors/piece/piece";
import {Timer} from "excalibur";

export class Player  {
  forward: number = 1;
  public ownedPieces= []
  public playerID:string= "0"
  score: number = 0;
  timer: Timer = new Timer({
    interval: 1200000, // 20 minutes,
    fcn: () => {
      console.log("Time's up")
      // end the game
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

  endTurn(){
    this.timer.start()
  }

  startTurn(){
    this.timer.pause()
  }

}
