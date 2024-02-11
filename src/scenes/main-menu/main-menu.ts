import {Actor, Color, Engine, Scene, vec} from "excalibur";
import {Resources} from "@/resources";

export class MainMenu extends Scene {
  // Hold a reference globally to our UI container
  // This would probably be encapsulated in a UIManager module
  private ui : HTMLElement = document.getElementById('ui')
  options:string[] = ['Practice', 'Story', 'Multiplayer' ,'Options']

  onInitialize(engine:Engine) {
    this.backgroundColor = Color.Black
    const backGroundImage = new Actor()
    console.log(engine.canvasWidth, engine.canvasHeight)
    backGroundImage.graphics.use(Resources.BackGround2.toSprite());
    backGroundImage.scale = vec(0.325, 0.325);
    backGroundImage.pos = engine.screen.center;


    this.add(backGroundImage);
    // Add a CSS class to `ui` that helps indicate which scene is being displayed
    this.ui.classList.add('MainMenu')
    for (let i = 0; i < this.options.length; i++) {
      this.ui.appendChild(this.createButtonElement(this.options[i], engine, 'practice0'))
    }
  }
  onDeactivate() {
    // Ensure we cleanup the DOM and remove any children when transitioning scenes
    this.ui.classList.remove('MainMenu')
    this.ui.innerHTML = ''
  }

  private createButtonElement(text:string, engine:Engine, scene:string) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'main-menu__button'
    btn.onclick = (e) => {
      e.preventDefault()
      engine.goToScene(scene)
    }
    return btn
  }
}
