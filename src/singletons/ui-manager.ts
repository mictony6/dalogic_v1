import {Engine} from "excalibur";

export class UiManager{
  static _instance : UiManager;
  constructor(public engine : Engine) {
    if (UiManager._instance){
      return UiManager._instance;
    }
    UiManager._instance = this;

  }

  static get instance(){
    return UiManager._instance;
  }

  public createMainMenuButtons(text:string, scene:string) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.className = 'main-menu__button'
    btn.onclick = (e) => {
      e.preventDefault()
      this.engine.goToScene(scene)
    }
    return btn
  }
}




