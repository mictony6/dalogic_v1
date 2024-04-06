import { Actor, Color, type Engine, Scene, type SceneActivationContext, vec} from "excalibur";
import {io, Socket} from "socket.io-client";
import {Board} from "@/actors/board/board";
import {Resources} from "@/resources";
import {UiManager} from "@/ui/ui-manager";
import {GameMode, sceneManager, state} from "@/store/store";
import {Player} from "@/actors/player/player";
import type {GameStateMachine} from "@/components/game-state-machine";
import Move from "@/components/move";
import { v4 as uuidv4 } from 'uuid';


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
        const socket = io(state.server);
        const playerID = uuidv4();
        state.player = new Player(-1, playerID)
        state.socket = socket;

        socket.on("connect", () => {
            socket.emit("registerPlayer", playerID);
        });


        socket.on("playerRegistered", (id) => {
            if (id === playerID){
                socket.emit("findMatch", playerID)
            }
        });


        socket.on("matchFound", (matchDetails) => {
            // put details in store
            this.setUp(matchDetails);
            socket.emit("playerReady", {roomId: state.roomID, playerID: playerID })
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

        socket.on("opponentDisconnected", () => {
          // wait for 1 minute till opponent reconnects
          // if not then go back to main menu
          // if opponent reconnects then continue the game
          console.log("Opponent disconnected")
          setTimeout(()=>{
              console.log("Opponent did not reconnect")
              socket.disconnect();
              sceneManager.push("mainMenu")
          }, 60100)
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


        textInput.oninput = (_e) => {
            socket.emit("playerTyping", {roomId:state.roomID, value:textInput.value});
        }

        
    }

    onDeactivate(_context: SceneActivationContext): void {
        this.ui.classList.remove('Multiplayer')
        this.ui.innerHTML = ""
        this.socket.disconnect();
        if (this.board){
            this.board.kill();
        }

    }

    onPostUpdate(engine: Engine, delta: number) {
        state.stateMachine.updateStateMachine(engine, delta);
    }

    private setUp(matchDetails : {}){
        // set up multiplayer game here
        let players : Array<string> = matchDetails["players"]

        state.opponent = new Player(1, players.find((id) => id !== state.player["playerID"]));
        state.currentPlayerID = matchDetails["isTurn"] ? state.player["playerID"] : state.opponent["playerID"];
        state.roomID = matchDetails["roomId"];

        // board config
        this.board = new Board(matchDetails["boardConfig"]);
        this.add(this.board)
        state.boardManager.currentBoard = this.board;


        UiManager.displayScoreLabels();
        UiManager.displayTimer();
    }
    
    
}
