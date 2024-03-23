import {  Scene, SceneActivationContext } from "excalibur";

export class GameOver extends Scene{
    
    onActivate(context: SceneActivationContext<unknown>): void {

        let gameMode = context.data["gameMode"];
        // display game over screen

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