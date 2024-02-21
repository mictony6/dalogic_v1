import {Loader, Actor, Engine, Scene, vec, Color} from "excalibur";
import {Resources} from "@/resources";

export class SplashLoader extends Loader {
  

  constructor(resources: any[]) {
    super(resources);
    this.logo = Resources.TitleLogo.path;
    this.logoHeight = 424
    this.logoWidth = 2174
    this.backgroundColor = '#31452D';
    
    this.startButtonFactory = () => {
      let myButton = document.createElement('button');
      myButton.textContent = 'START';
      myButton.id = 'startButton';
      return myButton;
    };
  }

}

export class SplashScenes extends Scene {
  private backgroundImage : Actor;
  private ui : HTMLElement = document.getElementById('ui')

  onInitialize(engine: Engine) {
    this.backgroundColor = Color.Black
    this.backgroundImage = new Actor({width:Resources.BackGround2.width, height:Resources.BackGround2.height});
    this.backgroundImage.graphics.use(Resources.BackGround2.toSprite());
    this.backgroundImage.scale = vec(0.35, 0.35)
  }
}
