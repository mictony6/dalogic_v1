import { AudioType, GameAudio } from "@/audio/GameAudio";
import {type Scene, vec, type Engine, EasingFunctions} from "excalibur";


export class SceneManager{
  stack : string[] = [];
  backButton: HTMLButtonElement;

  constructor(private engine : Engine) {

    this.backButton = document.getElementById("backButton") as HTMLButtonElement;
    this.backButton.onclick = this.back.bind(this);
    this.backButton.style.display = "none";


  }


  push(sceneName:string, data : any = undefined){


    if (sceneName === "authenticate" ){
      this.engine.goToScene(sceneName, data);
      return;
    }
    // push previous scene name here
    this.stack.push(sceneName);
    this.proceed(sceneName, data);

  }


  private proceed(sceneName: string, data: any={}) {
    if (sceneName == "practice" || sceneName == "multiplayer" || sceneName == "authenticate" || sceneName == "mainMenu"  ){
      this.backButton.style.display = 'none';
    } else{
      this.backButton.style.display = 'block';
    }

    // Fade out all actors in the current scene
    this.engine.currentScene.actors.forEach(actor => {
      // let fadeOutActor = setInterval(()=>{
      //   if (actor.graphics.opacity < 0.1) {
      //     clearInterval(fadeOutActor);
      //     actor.graphics.opacity = 0;
      //   }
      //   actor.graphics.opacity -= 0.1;
      // }, 10)
      actor.actions.fade(0, 250);
    });

    let ui: HTMLElement = document.getElementById('ui');
    // Fade in the UI elements
    let opacity = 1.0;
    let fadeOut = setInterval(() => {
      if (opacity < 0.1) {
        clearInterval(fadeOut);
        ui.style.opacity = '1.0';

      }
      opacity -= 0.1;
      ui.style.opacity = opacity.toString();
    }, 10)


    // After the fade out is complete, transition to the next scene
    setTimeout(() => {

      this.engine.currentScene.actors.forEach(actor => {
        actor.graphics.opacity = 1;
      });
      // Fade in the UI elements
      opacity = 0;
      let fadeIn = setInterval(() => {
        if (opacity > 0.9) {
          clearInterval(fadeIn);
          ui.style.opacity = '1.0';

        }
        opacity += 0.1;
        ui.style.opacity = opacity.toString();
      }, 10)
      this.engine.goToScene(sceneName, data);
      if ((sceneName !== "practice") && (sceneName !== "multiplayer")) {
        this.engine.currentScene.actors.forEach(actor => {
          actor.graphics.opacity = 0;
          let fadeInActor = setInterval(() => {
            if (actor.graphics.opacity > 1.0) {
              clearInterval(fadeInActor);
              actor.graphics.opacity = 1;
            }
            actor.graphics.opacity += 0.1;
          }, 10)
        })
      } else {
        this.engine.currentScene.actors.forEach(actor => {
          actor.graphics.opacity = 1;
        })
      }
    }, 250);
  }

  pop(){
    console.log(this.stack)
    const top = this.stack.pop();
    this.proceed(this.stack[this.stack.length-1]);
    return top;
  }


  private back() {
    switch(this.stack[this.stack.length-1]){
      case "mainMenu":
        break;
      case "levelSelection":
        this.pop();
        break;
      case "practice":
        this.pop();
        break;
      case "authenticate":
        break;
      case "gameOverScreen":
        this.push("mainMenu");
        break;
      case "leaderboard":
        this.push("mainMenu");
        break;
      case "tutorial":
        this.pop();
        break;
    }
  }
}