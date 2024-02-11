import { Engine, Scene } from 'excalibur';
import {Player} from "@/actors/player/player";

/**
 * Managed scene
 */
export class LevelOne extends Scene {
  player : Player;
  public onInitialize(engine: Engine) {
    this.player = new Player();
    this.add(this.player);
    this.player.scale.setTo(0.5, 0.5);
  }
  public onActivate() {}
  public onDeactivate() {}
  public onPreUpdate(engine: Engine, delta: number) {
    this.player.vel.setTo(10, 10);
  }
  public onPostUpdate(engine: Engine, delta: number) {
    this.player.pos.add(this.player.vel.scale(delta));
  }


}
