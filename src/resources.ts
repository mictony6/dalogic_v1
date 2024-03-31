import { ImageSource} from 'excalibur';
import piece from './images/assets/pieceSprite.png';
import bg1 from './images/assets/bg.png';
import bg2 from './images/assets/bg2.png';
import bg3 from './images/assets/bg3.png';
import titlelogo from './images/assets/titleSprite.png';
import startButton from './images/assets/startButton.png';
import gameBoardBg from './images/assets/gameboardbg.png';
// import buttonClick from './audio/blipSelect.wav';
// import buttonClick1 from './audio/blipSelect1.wav';
import storyscene0 from './images/assets/storyscene0.png';
import storyscene1 from './images/assets/storyscene1.png';
import storyscene2 from './images/assets/storyscene2.png';
import piece2 from './images/assets/pieceSprite2.png';


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
    // ButtonClick: new Sound(buttonClick),
    // ButtonClick1: new Sound(buttonClick1)
}

export { Resources }
