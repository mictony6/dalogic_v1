import {Scene, type SceneActivationContext} from "excalibur";


export class GameOverScreen extends Scene{
    private ui: HTMLElement = document.getElementById('ui');
    
    onActivate(context: SceneActivationContext<unknown>): void {

        let gameMode = context.data["gameMode"];
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


}