import { Engine, Scene, SceneActivationContext } from "excalibur";
import { io } from "socket.io-client";

export class Multiplayer extends Scene{
    onInitialize(engine: Engine): void {
        
    }

    onActivate(context: SceneActivationContext<unknown>): void {
        const socket = io("http://127.0.0.1:3000");
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });
    }
    
}

//functions for multiplayer

// find match

// client clicks find match
// server puts player in a queue
// try to find match using certain algorithm
// if server finds a match then it broadcasts to both players that it found match along with the 
// details for the room and 
// the other player's ID as well as who 
// get the turn first
// and board config then
// details are put in store



// game goes to scene for multiplayer game
// set up the ui
// initialize the players, get player name and ID from store
// set up board
// emit that its ready
// wait for other player to be ready

// if both are ready then the game will start



// player executes a move, emits the move detail
// server flips the move direction
// server broadcasts the move
// player receives the broadcast and executes
// switch turn

// game is over
