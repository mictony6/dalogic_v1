import { Engine, Scene } from "excalibur";
import axios from "axios";


export class Authenticate extends Scene {
  private ui: HTMLElement = document.getElementById('ui');
  private playerNameInput: HTMLInputElement;
  private enterButton: HTMLButtonElement;

  onInitialize(engine: Engine) {
    // Create input field for player name
    this.playerNameInput = document.createElement('input');
    this.playerNameInput.type = 'text';
    this.playerNameInput.placeholder = 'Enter your name';
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
