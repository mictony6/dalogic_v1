import {Color, type Engine, Scene, type SceneActivationContext} from "excalibur";
import {GameMode, sceneManager} from "@/store/store";


export class GameOverScreen extends Scene{
    private ui: HTMLElement = document.getElementById('ui');
    private logoPlaceholder: HTMLHeadingElement;
    private yourScoreDisplay: HTMLDivElement;
    private opponentScoreDisplay: HTMLDivElement;

    onInitialize(engine:Engine) {
        this.backgroundColor = Color.Black
    }

    onActivate(context: SceneActivationContext<unknown>): void {

        const gameMode : GameMode = context.data["gameMode"];
        const yourScore : number = context.data["yourScore"];
        const opponentScore : number = context.data["opponentScore"]
        // const winStatus : number  = yourScore === opponentScore ? 0 : yourScore > opponentScore ? 1 : -1;

        this.logoPlaceholder = document.createElement('h1');
        this.logoPlaceholder.className = "gameover-title";
        this.logoPlaceholder.textContent = yourScore > opponentScore ? 'YOU WON!' : 'GAME OVER';
        this.ui.appendChild(this.logoPlaceholder);
   
        this.yourScoreDisplay = document.createElement('div');
        this.yourScoreDisplay.className = "score-display";
        this.yourScoreDisplay.textContent = 'Your Score: '+yourScore.toString(); // replace

        this.opponentScoreDisplay = document.createElement('div');
       
        this.opponentScoreDisplay.className = "score-display";
        this.opponentScoreDisplay.textContent = 'Opponent Score: ' + opponentScore.toString();

        // Append score displays to UI
        this.ui.appendChild(this.yourScoreDisplay);
        this.ui.appendChild(this.opponentScoreDisplay);

        // Create button
        let nextButton  = this.createNextButton(gameMode);
        this.ui.appendChild(nextButton);

        // Create button
        const returnButton = document.createElement('button');
        returnButton.textContent = 'TO MAIN MENU';
        returnButton.onclick = () => {
            sceneManager.push("mainMenu");
        }
        this.ui.appendChild(returnButton);

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
        // button to return to MAIN MENU

        // create the buttons lang miskin di functional
        // ako lang bahala sa logic and for condition kung ano ang gameMode

    }

    onDeactivate(context: SceneActivationContext) {
        // Ensure we clean-up the DOM and remove any children when transitioning scenes
        this.ui.classList.remove('authenticate');
        this.ui.innerHTML = '';
    }

    private createNextButton(gameMode: GameMode) : HTMLButtonElement{
        const btn = document.createElement('button');
        switch (gameMode){
            case GameMode.AIVsPlayer:
                btn.textContent = "PICK A LEVEL";
                btn.onclick = () => {
                    sceneManager.push("levelSelection")
                }
                break;
            case GameMode.PlayerVsPlayer:
                btn.textContent = "NEW MATCH";
                btn.onclick = () => {
                    sceneManager.push("multiplayer")
                }
                break;
        }
        return btn;
    }

}