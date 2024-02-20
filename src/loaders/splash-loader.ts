import {Loader, Actor, Engine, Scene, vec, Color} from "excalibur";
import {Resources} from "@/resources";

export class SplashLoader extends Loader {
  

  constructor(resources: any[]) {
    super(resources);
    this.logo = Resources.TitleLogo.path;
    this.logoHeight = 424
    this.logoWidth = 2174

    
    this.startButtonFactory = () => {
      let myButton = document.createElement('button');
      myButton.textContent = 'START';
      myButton.id = 'startButton';
      return myButton;
    };
  }

}

// wont work pa
export class SplashScenes extends Scene {
  private backgroundImage : HTMLBodyElement;
  private ui : HTMLElement = document.getElementById('ui')

  onInitialize(engine: Engine) {
    // Get background image id
    this.backgroundImage = document.getElementById('backgroundImage') as HTMLBodyElement;
    this.backgroundImage.style.backgroundImage = `url(${Resources.BackGround2.path})`;
    this.ui.appendChild(this.backgroundImage);
  }
}
