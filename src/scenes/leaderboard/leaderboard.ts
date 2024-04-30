import { sceneManager } from "@/store/store";
import {Actor, Color, type Engine, Scene, type SceneActivationContext} from "excalibur";
import {getDatabase, ref, orderByChild, limitToLast, query, onValue} from "firebase/database";

export class Leaderboard extends Scene{
  private ui : HTMLElement = document.getElementById('ui')
  private pauseMenu: HTMLDialogElement;

  onInitialize(engine:Engine) {
    this.backgroundColor = Color.Black
  }

  onActivate(context: SceneActivationContext<unknown>) {
    this.ui.classList.add('Leaderboard')
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.classList.add('leaderboard-container');
    leaderboardContainer.innerHTML = `
    <h2>Leaderboard</h2>`;

    const database = getDatabase();

    let usersRef = ref(database, 'users');
    let topUsersRef = query( usersRef, orderByChild('highestScore'), limitToLast(5));
    onValue(topUsersRef, (snapshot) => {

      let data = []
      snapshot.forEach((childSnapshot) => {
        data.push([childSnapshot.key, childSnapshot.val().highestScore]);
      });

      data.reverse();
      leaderboardContainer.innerHTML = `
        <h2>Leaderboard</h2>
        <div class="leaderboard-item"><h4>User</h4><div></div><h4>Hi Score</h4></div>`;
      data.forEach(entry => {
        leaderboardContainer.appendChild(this.createLeaderBoardItem(entry[0], entry[1]));
      })

    }, {onlyOnce: true});

    this.ui.appendChild(leaderboardContainer);


    this.pauseMenu = document.createElement('dialog');
    this.pauseMenu.id = "pauseMenu";
    this.pauseMenu.className = "dialog";
    this.pauseMenu.innerHTML = `
    <h2 class="dialog-title">Navigation</h2> 
    <div class="dialog-content">
      <button type="button" id="exitButton">Exit to Main Menu</button>
      <button type="submit" class="close">Close</button>
    </div>`;

    

    this.ui.appendChild(this.pauseMenu);

    addEventListener("keydown", this.onPause);

    const exitButton = document.getElementById("exitButton");
    const closeButton = this.pauseMenu.getElementsByClassName("close")[0] as HTMLButtonElement;
    exitButton.onclick = this.onExitButtonClick.bind(this);
    closeButton.onclick = () => this.pauseMenu.close();





  }

  onPause(e:KeyboardEvent){
    // NOTE: T.T i fucking hate this, i thot i was doing something wrong
    // i realized pressing a key triggers the default button behaviour
    // lesson learned, always call preventDefault method when overriding button behaviour
    if (e.code == "Escape"){
      e.preventDefault();
      this.pauseMenu.showModal();
    }
  }

  onExitButtonClick() {
    this.pauseMenu.close()
    sceneManager.push("mainMenu");
  }

  onDeactivate(context: SceneActivationContext) {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
    removeEventListener("keydown", this.onPause);
    this.ui.classList.remove('Leaderboard')
    this.ui.innerHTML = ''
  }

  createLeaderBoardItem(name: string, score: number) {
    const item = document.createElement('div');
    item.classList.add('leaderboard-item');
    item.innerHTML = `<p>${name}</p><div></div><p>${score}</p>`;
    return item;
  }
}