import { Resources } from "@/resources";
import { Actor, Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";

export class StoryLevelSelection extends Scene{
    // Hold a reference globally to our UI container
  // This would probably be encapsulated in a UIManager module
  private ui : HTMLElement = document.getElementById('ui')
  options:string[] = ['1', '2', '3' ,'4', '5']
  private backgroundImage : Actor;
  private playerName : string;
  private gameMode: HTMLHeadingElement;

  
  onInitialize(engine: Engine): void {
    this.backgroundColor = Color.Black
    this.backgroundImage = new Actor({width:Resources.BackGround3.width, height:Resources.BackGround3.height})
    this.backgroundImage.graphics.use(Resources.BackGround3.toSprite());
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
    this.gameMode = document.createElement('h1');
    this.gameMode.textContent = 'STORY MODE';
    wrapper.appendChild(this.gameMode);

    // Add the wrapper to the UI
    this.ui.appendChild(wrapper);

  }

  onDeactivate() {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    this.ui.classList.remove('StoryLevelSelection')
    this.ui.innerHTML = ''
  }



}