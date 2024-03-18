import { Resources } from "@/resources";
import { Actor, Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";

export class StoryLevelSelection extends Scene{
    // Hold a reference globally to our UI container
  // This would probably be encapsulated in a UIManager module
  private ui : HTMLElement = document.getElementById('ui')
  options:string[] = ['<', '>']
  private backgroundImage : Actor;
  private playerName : string;
  private gameMode: HTMLHeadingElement;

  
  onInitialize(engine: Engine): void {
    this.backgroundColor = Color.Black
    this.backgroundImage = new Actor({width:Resources.StoryScene0.width, height:Resources.StoryScene0.height})
    this.backgroundImage.graphics.use(Resources.StoryScene0.toSprite());
    this.backgroundImage.scale = vec(0.70, 0.70)
    // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
    this.backgroundImage.pos = engine.screen.center;
    this.add(this.backgroundImage);

      
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    
    this.ui.classList.add('StorySelection')

    let wrapper = document.createElement('div');
    wrapper.classList.add('story-selection-wrapper');

    // Add a title to the scene
    this.gameMode = document.createElement('h3');
    this.gameMode.textContent = 'STORY MODE';
    wrapper.appendChild(this.gameMode);

    this.gameMode = document.createElement('p');
    this.gameMode.textContent = 'New Admin Building';
    wrapper.appendChild(this.gameMode);


    // button group wrapper
    let buttonGroup = document.createElement('div');
    buttonGroup.classList.add('scene-selector');
    wrapper.appendChild(buttonGroup);

    // Add buttons for each level
    
    buttonGroup.appendChild(this.createButtonElement(this.options[0], 'story2'))
    buttonGroup.appendChild(this.createButtonElement(this.options[1], 'story1'))
    
    // Add the wrapper to the UI
    this.ui.appendChild(wrapper);



  }

  onDeactivate() {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    this.ui.classList.remove('StorySelection')
    this.ui.innerHTML = ''
  }

  private createButtonElement(text:string, scene:string) {
    const btn = document.createElement('level_button')
    btn.innerText = text
    btn.className = 'level__button'
    btn.onclick = (e) => {
      e.preventDefault()
      this.engine.goToScene(scene)
    }
    return btn
  }

}