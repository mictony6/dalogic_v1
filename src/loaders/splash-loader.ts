import {Loader} from "excalibur";
import {Resources} from "@/resources";

export class SplashLoader extends Loader {
  

  constructor() {
    super(Object.values(Resources));
    this.logo = Resources.TitleLogo.path;
    this.logoHeight = 424
    this.logoWidth = 2174
    this.backgroundColor = '#31452D';
    
  }

  startButtonFactory = () => {
    let myButton = document.createElement('button');
    myButton.textContent = 'START';
    myButton.id = 'startButton';
    return myButton;
  }

}

