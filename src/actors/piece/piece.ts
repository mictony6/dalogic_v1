import {Actor, Engine, vec} from "excalibur";
import {Resources} from "@/resources";

export class Piece extends Actor{
  constructor() {
    super({radius:150/2});
  }
  onInitialize(engine: Engine) {
    this.scale = vec(0.5, 0.5)
    this.graphics.use(Resources.Piece.toSprite());
  }
}