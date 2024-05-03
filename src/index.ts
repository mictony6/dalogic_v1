import '../styles.css';
import {Color, DisplayMode, Engine} from "excalibur";
import {initStore, sceneManager} from "@/store/store";
import {MainMenu} from "@/scenes/main-menu/main-menu";
import {LevelSelection} from "@/scenes/level-selection/level-selection";
import {PracticeLevel} from "@/scenes/practice/practice-level";
import {Authenticate} from "@/scenes/authenticate/authenticate";
import {GameOverScreen} from "@/scenes/game-over/game-over-screen";
import {Multiplayer} from "@/scenes/multiplayer/multiplayer";
import {SplashLoader} from "@/loaders/splash-loader";
import "@/store/gameDatabase";
import {getDatabase, ref, onValue} from "firebase/database";
import {Leaderboard} from "@/scenes/leaderboard/leaderboard";
import {Tutorial} from "@/scenes/tutorial/tutorial-screen";

// import {DevTool} from "@excaliburjs/dev-tools";


/**
 * Managed game class
 */
class Game extends Engine {
  constructor() {
    super({ displayMode: DisplayMode.FitScreen,width:1280, height:720, canvasElementId: 'game'});
  }

  public start() {

    this.backgroundColor = Color.Black;

    initStore(this);
  
    game.add('mainMenu', new MainMenu());
    game.add('levelSelection', new LevelSelection());
    game.add('practice', new PracticeLevel());
    game.add('authenticate', new Authenticate());
    game.add('gameOverScreen', new GameOverScreen());
    game.add('multiplayer', new Multiplayer());
    game.add('leaderboard', new Leaderboard());
    game.add('tutorial', new Tutorial());


    // Automatically load all default resources
    const loader = new SplashLoader();

    return super.start(loader);
  }

}

const game = new Game();
// const devtool = new DevTool(game);
game.start().then(() => {
  // game.goToScene('authenticate');
  // new GameAudio().play(AudioType.BG, 0.6, true);
  sceneManager.push('authenticate')
});
