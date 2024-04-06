import '../styles.css';
import {DisplayMode, Engine} from "excalibur";
import {initStore, sceneManager} from "@/store/store";
import {MainMenu} from "@/scenes/main-menu/main-menu";
import {LevelSelection} from "@/scenes/level-selection/level-selection";
import {PracticeLevel0} from "@/scenes/practice/practice-level0";
import {Authenticate} from "@/scenes/authenticate/authenticate";
import {StoryLevelSelection} from "@/scenes/story-level-selection/story-level-selection";
import {StoryLevelSelection1} from "@/scenes/story-level-selection/story-level-selection1";
import {StoryLevelSelection2} from "@/scenes/story-level-selection/story-level-selection2";
import {GameOverScreen} from "@/scenes/game-over/game-over-screen";
import {Multiplayer} from "@/scenes/multiplayer/multiplayer";
import {SplashLoader} from "@/loaders/splash-loader";
// import {DevTool} from "@excaliburjs/dev-tools";


/**
 * Managed game class
 */
class Game extends Engine {
  constructor() {
    super({ displayMode: DisplayMode.FitScreen,width:1280, height:720, canvasElementId: 'game'});
  }

  public start() {

    initStore(this);

    game.add('mainMenu', new MainMenu());
    game.add('levelSelection', new LevelSelection());
    game.add('practice0', new PracticeLevel0());
    game.add('authenticate', new Authenticate());
    game.add('story0', new StoryLevelSelection());
    game.add('story1', new StoryLevelSelection1());
    game.add('story2', new StoryLevelSelection2());
    game.add('gameOverScreen', new GameOverScreen());
    game.add('multiplayer', new Multiplayer());


    // Automatically load all default resources
    const loader = new SplashLoader();

    return super.start(loader);
  }

}

const game = new Game();
// const devtool = new DevTool(game);
game.start().then(() => {
  // game.goToScene('authenticate');
  sceneManager.push('authenticate')
});
