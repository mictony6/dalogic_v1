import {Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {Resources} from "@/resources";

export class GameOverScreen extends Scene{
    private ui: HTMLElement = document.getElementById('ui');
    
    private backgroundImage : Actor;
    private logoPlaceholder: HTMLHeadingElement;
    private enterButton: HTMLButtonElement;
    private yourScoreDisplay: HTMLDivElement;
    private opponentScoreDisplay: HTMLDivElement;

    onInitialize(engine:Engine) {
        this.backgroundColor = Color.Black
        // this.backgroundImage = new Actor({width:Resources.BackGround3.width, height:Resources.BackGround3.height}) //CHANGE BACKGROUND 
        // this.backgroundImage.graphics.use(Resources.BackGround3.toSprite());
        // this.backgroundImage.scale = vec(0.70, 0.70)
        // // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
        // this.backgroundImage.pos = engine.screen.center;
        // this.add(this.backgroundImage);
    }

    onActivate(context: SceneActivationContext<unknown>): void {

        let gameMode = context.data["gameMode"];

        this.logoPlaceholder = document.createElement('h1');
        this.logoPlaceholder.className = "gameover-title";
        this.logoPlaceholder.textContent = 'GAME OVER';
        this.ui.appendChild(this.logoPlaceholder);
   
        this.yourScoreDisplay = document.createElement('div');
        this.yourScoreDisplay.className = "score-display";
        this.yourScoreDisplay.textContent = 'Your Score: '; // replace

        this.opponentScoreDisplay = document.createElement('div');
       
        this.opponentScoreDisplay.className = "score-display";
        this.opponentScoreDisplay.textContent = 'Opponent Score: ';

        // Append score displays to UI
        this.ui.appendChild(this.yourScoreDisplay);
        this.ui.appendChild(this.opponentScoreDisplay);
        // Create button
        this.enterButton = document.createElement('button');
        this.enterButton.textContent = 'NEXT MATCH';
        
        this.ui.appendChild(this.enterButton);

        // Create button
        this.enterButton = document.createElement('button');
        this.enterButton.textContent = 'RETURN';
        
        this.ui.appendChild(this.enterButton);

        // Add CSS class to style UI elements if needed
        this.ui.classList.add('authenticate');

        // display game over screen

        // black lang bg oki
        // label/image saying "GAME OVER" in upheaval font
        // use sans serif or other font for below elements
        // -----------------------------
        //| Your Score | Opponent Score |
        //|     100    |       50       |
        // -----------------------------
        // button to NEXT MATCH for multiplayer
        // button to RESTART for story mode
        // button to return to MAIN MENU

        // create the buttons lang miskin di functional
        // ako lang bahala sa logic and for condition kung ano ang gameMode

    }

    onDeactivate(context: SceneActivationContext) {
        // Ensure we clean-up the DOM and remove any children when transitioning scenes
        this.ui.classList.remove('authenticate');
        this.ui.innerHTML = '';
    }


}