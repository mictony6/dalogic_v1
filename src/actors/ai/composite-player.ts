import {AiPlayer} from "@/actors/ai/ai-player";
import  Move from "@/components/move";
import type {CaptureMove} from "@/components/capture-move";
import  {type Piece} from "@/actors/piece/piece";

/**
 * A mix of two ai players
 */
export class CompositePlayer extends AiPlayer{
  private players : AiPlayer[];
  private weights : number[];

  constructor(forward: number, id: string, data : {players: AiPlayer[], weights: number[]}) {
    super(forward, id);

    if (data.players.length !== data.weights.length) throw new Error("The number of players and weights must be the same");

    this.players = data.players;
    this.weights = data.weights;
  }
  takeTurn(): void {
    this.getBestMove().commit();
  }

  getBestMove(): Move | CaptureMove {
    const bestMoves : (Move | CaptureMove)[] = this.players.map(player => player.getBestMove());

    // Normalize the weights
    const sum = this.weights.reduce((a, b) => a + b, 0);
    const normalizedWeights = this.weights.map(weight => weight / sum);

    // Generate a random number
    const random = Math.random();

    // Select a move based on the weights
    let total = 0;
    for (let i = 0; i < normalizedWeights.length; i++) {
      total += normalizedWeights[i];
      if (random < total) {
        return bestMoves[i];
      }
    }

    // If no move is selected (due to floating point precision issues), return the last move
    return bestMoves[bestMoves.length - 1];
  }

  owns(piece: Piece) {
    super.owns(piece);
    this.players.forEach(player => player.owns(piece));
  }

  remove(piece: Piece) {
    super.remove(piece);
    this.players.forEach(player => player.remove(piece));
  }

  addScore(n: number) {
    super.addScore(n);
    this.players.forEach(player => player.addScore(n));
  }

}