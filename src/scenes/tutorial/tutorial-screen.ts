import { Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {Resources} from "@/resources";
import { sceneManager } from "@/store/store";


export class Tutorial extends Scene {
  private ui : HTMLElement = document.getElementById('ui')
  private backgroundImage : Actor;
  private pauseMenu: HTMLDialogElement;

  onInitialize(engine:Engine) {
    this.backgroundColor = Color.Black
    this.backgroundImage = new Actor({width:Resources.TutorialBg1.width, height:Resources.TutorialBg1.height})
    this.backgroundImage.graphics.use(Resources.TutorialBg1.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);
  }


  onActivate(context: SceneActivationContext<unknown>) {
    this.ui.classList.add('Tutorial')

    let wrapper = document.createElement('div');
    wrapper.classList.add('tutorial-wrapper');

    // Add the wrapper to the UI
    this.ui.appendChild(wrapper);

    this.pauseMenu = document.createElement('dialog');
    this.pauseMenu.id = "pauseMenu";
    this.pauseMenu.className = "dialog";
    this.pauseMenu.innerHTML = `
    <h2 class="dialog-title">Navigation</h2> 
    <div class="dialog-content">
      <button type="button" id="exitButton">Exit to Main Menu</button>
      <button type="submit" class="close">Close</button>
    </div>`;

    

    this.ui.appendChild(this.pauseMenu);

    addEventListener("keydown", this.onPause);

    const exitButton = document.getElementById("exitButton");
    const closeButton = this.pauseMenu.getElementsByClassName("close")[0] as HTMLButtonElement;
    exitButton.onclick = this.onExitButtonClick.bind(this);
    closeButton.onclick = () => this.pauseMenu.close();
  }

  onPause(e:KeyboardEvent){
    // NOTE: T.T i fucking hate this, i thot i was doing something wrong
    // i realized pressing a key triggers the default button behaviour
    // lesson learned, always call preventDefault method when overriding button behaviour
    if (e.code == "Escape"){
      e.preventDefault();
      this.pauseMenu.showModal();
    }
  }

  onExitButtonClick() {
    this.pauseMenu.close()
    sceneManager.push("mainMenu");
  }

  onDeactivate(context: SceneActivationContext) {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    removeEventListener("keydown", this.onPause);
    this.ui.classList.remove('Tutorial')
    this.ui.innerHTML = ''
  }


}
