import {Player} from "@/actors/player/player";
import type Move from "@/components/move";
import type {CaptureMove} from "@/components/capture-move";

export abstract class AiPlayer extends Player {
  constructor(forward: number, id:string) {
    super(forward, id);
  }

  abstract takeTurn(): void;
  abstract getBestMove(): Move | CaptureMove;

}