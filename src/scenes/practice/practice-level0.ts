import {Engine, Scene, Color, Actor, vec} from "excalibur";
import {Board} from "@/actors/board/board";
import {Resources} from "@/resources";

export class PracticeLevel0 extends Scene {
  private board : Board;
  private backgroundImage : Actor;
  
  public onInitialize(engine: Engine) {
    // Background
    this.backgroundColor = Color.Black;
    this.backgroundImage = new Actor({width:Resources.GameBoardBg.width, height:Resources.BackGround3.height})
    this.backgroundImage.graphics.use(Resources.GameBoardBg.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);

    // Board
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