import {Color, type Engine, Scene, type SceneActivationContext} from "excalibur";
import {GameMode, sceneManager, state} from "@/store/store";
import {getDatabase, onValue, ref, set} from "firebase/database";


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
        const winStatus : number  = yourScore === opponentScore ? 0 : yourScore > opponentScore ? 1 : -1;

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


        const leaderBoardButton = document.createElement('button');
        leaderBoardButton.textContent = 'VIEW LEADERBOARD';
        leaderBoardButton.onclick = () => {
            sceneManager.push("leaderboard");
        }
        this.ui.appendChild(leaderBoardButton);

        // Add CSS class to style UI elements if needed
        this.ui.classList.add('authenticate');


        this.updateDatabase(yourScore, winStatus)

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

    private updateDatabase(score:number, winStatus: number) {
        let userRef = ref(getDatabase(), 'users/' + state.playerName.toLowerCase());
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            const updatedUserData = {
                gamesPlayed: data.gamesPlayed ? data.gamesPlayed + 1 : 1,
                gamesWon: data.gamesWon ?  data.gamesWon + (winStatus === 1 ? 1 : 0) : winStatus ,
                highestScore: Math.max(data.highestScore, score),
            };
            set(userRef, updatedUserData);

        }, {onlyOnce: true});


    }
}