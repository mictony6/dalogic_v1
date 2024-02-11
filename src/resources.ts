import { ImageSource } from 'excalibur';
import piece from './images/assets/pieceSprite.png';
import bg1 from './images/assets/bg.png';
import bg2 from './images/assets/bg2.png';
import titlelogo from './images/assets/titleSprite.png';
import startButton from './images/assets/startButton.png';
/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
    Piece: new ImageSource(piece),
    BackGround1: new ImageSource(bg1),
    BackGround2: new ImageSource(bg2),
    TitleLogo : new ImageSource(titlelogo),
    StartButton: new ImageSource(startButton)
}

export { Resources }
