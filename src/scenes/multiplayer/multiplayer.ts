import {Board} from "@/actors/board/board";
import {Player} from "@/actors/player/player";
import {GameStateMachine} from "@/components/game-state-machine";
import Move from "@/components/move";
import {GameMode, state} from "@/store/store";
import {UiManager} from "@/ui/ui-manager";
import {Actor, Color, Engine, Scene, SceneActivationContext, vec} from "excalibur";
import {io, Socket} from "socket.io-client";
import {Resources} from "@/resources";

export class Multiplayer extends Scene{
    private socket : Socket;
    board: Board;
    private backgroundImage : Actor;
    private ui = document.getElementById('ui');

    onInitialize(engine: Engine) {
        // Background
        this.backgroundColor = Color.Black;
        this.backgroundImage = new Actor({width:Resources.GameBoardBg.width, height:Resources.BackGround3.height})
        this.backgroundImage.graphics.use(Resources.GameBoardBg.toSprite());
        this.backgroundImage.scale = vec(0.70, 0.70)
        // this.backgroundImage.scale = vec(engine.canvasWidth/Resources.BackGround2.width, engine.canvasHeight/Resources.BackGround2.height);
        this.backgroundImage.pos = engine.screen.center;
        this.add(this.backgroundImage);
    }

    onActivate(context: SceneActivationContext<unknown>): void {
        this.ui.classList.add('Multiplayer')
        let elements = UiManager.createModal()
        const dialog:HTMLDialogElement = elements.dialog
        this.ui.appendChild(dialog)
        const submit:HTMLButtonElement = elements.textInput
        const textInput : HTMLInputElement = elements.textInput



        state.gameMode = GameMode.PlayerVsPlayer;
        const socket = io("http://127.0.0.1:3000");
        state.socket = socket;

        socket.on("connect", () => {
            state.player = new Player(-1, socket.id);                   
            this.socket.emit("findMatch")
        });

        socket.on("matchFound", (matchDetails) => {
            // put details in store
 
            this.setUp(matchDetails);
            
            socket.emit("playerReady", state.roomID)
        });

        socket.on("startGame", () => {
            // Set the initial state
            let stateMachine : GameStateMachine = state.stateMachine
            stateMachine.changeState("switchingTurn",this.engine);
        })

        socket.on("opponentMove", (moveHash) => {
            this.board.selectedMove = Move.fromHash(moveHash, this.board);
            let stateMachine : GameStateMachine = state.stateMachine
            stateMachine.changeState("playerMoving", this.engine);
        })

        // when it receives an answer for a capture move dipatch an event
        socket.on("opponentAnswer", (opponentAnswer) => {
            let event = new CustomEvent("answer", {detail: opponentAnswer});
            dispatchEvent(event);
            dialog.close();
        })

        socket.on("opponentTyping", (value) => {
            textInput.value = value;
        })



        this.socket = socket;
        if (!socket){
            throw new Error("Socket not configure properly.")
        }


        addEventListener("playerMove", (e:CustomEvent) => {
            let move : Move = e.detail;
            let roomID : string = state.roomID;
            socket.emit("playerMove", {move: move.hash, roomId: roomID});
        })

        // when player answers modal, emit the answer to the server
        addEventListener("answer-submitted" , (e:CustomEvent) => {
            socket.emit("playerAnswer", {roomId:state.roomID, answer: e.detail});
        })


        textInput.oninput = (e) => {
            socket.emit("playerTyping", {roomId:state.roomID, value:textInput.value});
        }

        
    }

    onDeactivate(context: SceneActivationContext<undefined>): void {
        this.socket.disconnect();
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
