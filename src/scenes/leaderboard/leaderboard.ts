import {Actor, Color, type Engine, Scene, type SceneActivationContext} from "excalibur";
import {getDatabase, ref, orderByChild, limitToLast, query, onValue} from "firebase/database";

export class Leaderboard extends Scene{
  private ui : HTMLElement = document.getElementById('ui')
  private backgroundImage : Actor;

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


  }

  onDeactivate(context: SceneActivationContext) {
    // Ensure we clean-up the DOM and remove any children when transitioning scenes
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