import {Engine, DisplayMode} from 'excalibur';
import {MainMenu} from "@/scenes/main-menu/main-menu";
import {SplashLoader} from "@/loaders/splash-loader";
import {PracticeLevel0} from "@/scenes/practice/practice-level0";
import '../styles.css';
import {Authenticate} from "@/scenes/authenticate/authenticate";
import { LevelSelection } from './scenes/level-selection/level-selection';
import {initStore, state} from "@/store/store";


/**
 * Managed game class
 */
class Game extends Engine {
  constructor() {
    super({ displayMode: DisplayMode.FillScreen,width:1280, height:720, canvasElementId: 'game'});
  }

  public start() {

    initStore();

    game.add('mainMenu', new MainMenu());
    game.add('levelSelection', new LevelSelection());
    game.add('practice0', new PracticeLevel0());
    game.add('authenticate', new Authenticate());

    // Automatically load all default resources
    const loader = new SplashLoader();

    return super.start(loader);
  }

}

const game = new Game();
// const devtool = new DevTool(game);
game.start().then(() => {
  game.goToScene('authenticate');
});
