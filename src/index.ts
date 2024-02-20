import { Engine, Loader, DisplayMode } from 'excalibur';
import { Resources } from './resources';
import {MainMenu} from "@/scenes/main-menu/main-menu";
import {SplashLoader} from "@/loaders/splash-loader";
import {PracticeLevel0} from "@/scenes/practice/practice-level0";
import '../styles.css';
import {Authenticate} from "@/scenes/authenticate/authenticate";
import {DevTool} from "@excaliburjs/dev-tools";

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
    game.add('authenticate', new Authenticate());

    // Automatically load all default resources
    const loader = new SplashLoader(Object.values(Resources));

    return super.start(loader);
  }

}

const game = new Game();
// const devtool = new DevTool(game);
game.start().then(() => {
  game.goToScene('authenticate');
});
