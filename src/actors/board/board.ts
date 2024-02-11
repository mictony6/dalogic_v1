import { Actor, Color, vec } from 'excalibur';
import { Resources } from '@/resources';
import {transform} from "terser-webpack-plugin/types/minify";

export class Board extends Actor {
  constructor() {
    super({
      color: new Color(255, 255, 255)
    });
  }


  onInitialize() {

  }


}
