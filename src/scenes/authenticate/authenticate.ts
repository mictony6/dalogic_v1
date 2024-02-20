import { Actor, Engine, Scene, vec} from "excalibur";
import {Resources} from "@/resources";
import axios from "axios";


export class Authenticate extends Scene {
  private ui: HTMLElement = document.getElementById('ui');
  private logoPlaceholder: HTMLHeadingElement;
  private playerNameInput: HTMLInputElement;
  private enterButton: HTMLButtonElement;
  private backgroundImage : Actor;

  onInitialize(engine: Engine) {
    this.backgroundImage = new Actor({width:Resources.BackGround2.width, height:Resources.BackGround2.height})
    this.backgroundImage.graphics.use(Resources.BackGround2.toSprite());
    this.backgroundImage.scale = vec(0.35, 0.35)
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);

    this.logoPlaceholder = document.createElement('h1');
    this.logoPlaceholder.textContent = 'DALOGIC';
    this.ui.appendChild(this.logoPlaceholder);

    // Create input field for player name
    this.playerNameInput = document.createElement('input');
    this.playerNameInput.type = 'text';
    this.playerNameInput.placeholder = 'Player Name';
    this.ui.appendChild(this.playerNameInput);

    // Create button
    this.enterButton = document.createElement('button');
    this.enterButton.textContent = 'Enter';
    this.enterButton.addEventListener('click', this.onEnterClick.bind(this));
    this.ui.appendChild(this.enterButton);

    // Add CSS class to style UI elements if needed
    this.ui.classList.add('authenticate');
  }

  onEnterClick() {
    const playerName = this.playerNameInput.value;

    axios.post('http://127.0.0.1:3000/auth', {
      playerName:playerName
    }).then(r  =>{}).catch(e => console.log(e))
    // Handle entering the game with the provided player name
    // For example, you can transition to the next scene here
    this.engine.goToScene("mainMenu")
  }

  onDeactivate() {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    this.ui.classList.remove('authenticate');
    this.ui.innerHTML = '';
  }
}
