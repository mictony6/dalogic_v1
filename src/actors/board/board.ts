import {Actor, Color, Engine, vec} from 'excalibur';
import { Resources } from '@/resources';
import {transform} from "terser-webpack-plugin/types/minify";

export class Board extends Actor {
  constructor() {
    super({
      color: Color.Red,
      width: 75*8,
      height:75*8
    });
  }


  onInitialize(engine: Engine) {
    this.anchor = vec(0.5,0.5);
    this.pos = engine.screen.center

  }


}
