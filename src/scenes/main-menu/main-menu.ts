import { Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {Resources} from "@/resources";
import axios from "axios";
import {UiManager} from "@/ui/ui-manager";


export class MainMenu extends Scene {
  // Hold a reference globally to our UI container
  // This would probably be encapsulated in a UIManager module
  private ui : HTMLElement = document.getElementById('ui')
  options:string[] = ['Practice', 'Story', 'Multiplayer' ,'Options']
  sceneNames:string[] = ['levelSelection', 'story0', 'multiplayer', 'options'];
  private backgroundImage : Actor;
  private logoPlaceholder: HTMLHeadingElement;
  private playerName : string;

  onInitialize(engine:Engine) {
    this.backgroundColor = Color.Black
    this.backgroundImage = new Actor({width:Resources.BackGround3.width, height:Resources.BackGround3.height})
    this.backgroundImage.graphics.use(Resources.BackGround3.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);
    // Add a CSS class to `ui` that helps indicate which scene is being displayed

  }


  onActivate(context: SceneActivationContext<unknown>) {

    this.ui.classList.add('MainMenu')
    let playerLabel = document.createElement("h3");


    axios.get("http://127.0.0.1:3000/auth/player-name").then(res => {
      return res.data.playerName
    }).then((playerName) => {
      console.log(playerName)
      this.playerName = playerName

    }).catch(e =>  console.log(e))

    this.logoPlaceholder = document.createElement('h1');
    this.logoPlaceholder.textContent = 'DALOGIC';
    this.ui.appendChild(this.logoPlaceholder);

    this.ui.appendChild(playerLabel);
    for (let i = 0; i < this.options.length; i++) {
      this.ui.appendChild(UiManager.createMainMenuButton(this.options[i], this.sceneNames[i]))
    }
  }

  onDeactivate() {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    this.ui.classList.remove('MainMenu')
    this.ui.innerHTML = ''
  }


  onPostUpdate(engine: Engine, delta: number) {
    let playerLabel = document.createElement("h3");
    playerLabel.innerHTML = `Hello, ${this.playerName}!`;
  }


}
