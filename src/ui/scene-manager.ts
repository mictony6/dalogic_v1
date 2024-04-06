import type {Engine} from "excalibur";

export class SceneManager{
  stack : string[] = [];

  constructor(private engine : Engine) {
    // go back to levelSelection when escape key pressed
    // addEventListener("keydown", e => {
    //   if (e.code == "Escape"){
    //     this.pop();
    //   }
    // })

  }


  push(sceneName:string, data : any = undefined){
    // push previous scene name here
    this.stack.push(sceneName);
    this.engine.goToScene(sceneName, data);
  }

  pop(){
    console.log(this.stack)
    const top = this.stack.pop();
    this.engine.goToScene(this.stack[this.stack.length-1]);
    return top;
  }




}