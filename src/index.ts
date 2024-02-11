import { Engine, Loader, DisplayMode } from 'excalibur';
import { Resources } from './resources';
import {MainMenu} from "@/scenes/main-menu/main-menu";
import {SplashLoader} from "@/loaders/splash-loader";
import {PracticeLevel0} from "@/scenes/practice/practice-level0";
import {LevelOne} from "@/scenes/level-one/level-one";
import '../styles.css';

/**
 * Managed game class
 */
class Game extends Engine {
  constructor() {
    super({ displayMode: DisplayMode.FitScreen,width:1280, height:720, canvasElementId: 'game'});
  }


  public start() {

    game.add('mainMenu', new MainMenu());
    game.add('practice0', new PracticeLevel0());

    // Automatically load all default resources
    const loader = new SplashLoader(Object.values(Resources));

    return super.start(loader);
  }

}

const game = new Game();
game.start().then(() => {
  game.goToScene('mainMenu');
});
