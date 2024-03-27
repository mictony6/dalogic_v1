import { Board } from "@/actors/board/board";
import { Player } from "@/actors/player/player";
import { GameStateMachine } from "@/components/game-state-machine";
import { GameMode, state } from "@/store/store";
import { UiManager } from "@/ui/ui-manager";
import { Engine, Scene, SceneActivationContext } from "excalibur";
import { io, Socket } from "socket.io-client";

export class Multiplayer extends Scene{
    private socket : Socket;
    board: Board;


    onActivate(context: SceneActivationContext<unknown>): void {
        state.gameMode = GameMode.PlayerVsPlayer;
        const socket = io("http://127.0.0.1:3000");

        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            state.player = new Player(-1, socket.id);                   
            this.socket.emit("findMatch")
        });

        socket.on("matchFound", (matchDetails) => {
            // put details in store
 
            this.setUp(matchDetails);
            console.log(state.player, state.opponent);
            
            socket.emit("playerReady", state.roomID)
        });

        socket.on("startGame", () => {
            // Set the initial state
            let stateMachine : GameStateMachine = state.stateMachine
            stateMachine.changeState("switchingTurn",this.engine);
        })

        this.socket = socket;
        if (!socket){
            throw new Error("Socket not configure properly.")
        }
        
        
    }

    onPostUpdate(engine: Engine, delta: number) {
        state.stateMachine.updateStateMachine(engine, delta);
    }

    private setUp(matchDetails){
        // set up multiplayer game here
        let players : Array<string> = matchDetails["players"]

        state.opponent = new Player(1, players.find((id) => id !== this.socket.id));
        state.currentPlayerID = matchDetails["currentPlayerId"];
        state.roomID = matchDetails["roomId"];

        // board config
        this.board = new Board(matchDetails["boardConfig"]);
        this.add(this.board)
        state.boardManager.currentBoard = this.board;


        UiManager.displayScoreLabels();
        UiManager.displayTimer();
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
