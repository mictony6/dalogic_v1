import {Engine, Scene, vec} from "excalibur";
import {Board} from "@/actors/board/board";

export class PracticeLevel0 extends Scene {
  private board : Board;
  public onInitialize(engine: Engine) {
    this.board = new Board()
    this.add(this.board)
  }

  public onActivate() {
  }

  public onDeactivate() {
  }

  onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
  }
}