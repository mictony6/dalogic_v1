import { ImageSource, Sound} from 'excalibur';
import piece from './images/assets/pieceSprite.png';
import bg1 from './images/assets/bg.png';
import bg2 from './images/assets/bg2.png';
import bg3 from './images/assets/bg3.png';
import titlelogo from './images/assets/titleSprite.png';
import startButton from './images/assets/startButton.png';
import gameBoardBg from './images/assets/gameboardbg.png';
import storyscene0 from './images/assets/storyscene0.png';
import storyscene1 from './images/assets/storyscene1.png';
import storyscene2 from './images/assets/storyscene2.png';
import piece2 from './images/assets/pieceSprite2.png';
import select1 from './audio/select1.wav';
import select2 from './audio/select2.wav';
import score1 from './audio/score1.wav';
import score2 from './audio/score2.wav';
import score3 from './audio/score3.wav';
import bgMusic from './audio/bg.wav';
import move1 from './audio/move1.wav';
import move2 from './audio/move2.wav';


/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
    Piece: new ImageSource(piece),
    Piece2: new ImageSource(piece2),
    BackGround1: new ImageSource(bg1),
    BackGround2: new ImageSource(bg2),
    BackGround3: new ImageSource(bg3),
    StoryScene0: new ImageSource(storyscene0),
    StoryScene1: new ImageSource(storyscene1),
    StoryScene2: new ImageSource(storyscene2),
    GameBoardBg: new ImageSource(gameBoardBg),
    TitleLogo : new ImageSource(titlelogo),
    StartButton: new ImageSource(startButton),
    Select1: new Sound(select1),
    Select2: new Sound(select2),
    Score1: new Sound(score1),
    Score2: new Sound(score2),
    Score3: new Sound(score3),
    BGMusic: new Sound(bgMusic),
    Move1: new Sound(move1),
    Move2: new Sound(move2),

}

export { Resources }
