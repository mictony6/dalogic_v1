import {Actor, GraphicsGroup, Circle, Engine, vec, Color, Sprite, Shape, Label, FontStyle, Font, TextAlign, BaseAlign} from "excalibur";
import {Resources} from "@/resources";
import {Player} from "@/actors/player/player";

const pieceDistrib = [3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 0, 0]
export class Piece extends Actor{
  private selectedGraphics: GraphicsGroup;
  private originalGraphics: Sprite;
  private valueLabel: Label;
  _value: number = 0;
  binRep: string;
  owner: Player;


  constructor(public row: number, public col: number) {
    super({
      collider: Shape.Box(75,75),
      width:75,
      height:75}
    );


  }
  onInitialize(engine: Engine) {

    this.z = 1;
    this.originalGraphics = Resources.Piece.toSprite();
    this.originalGraphics.scale = vec(0.5,0.5);
    this.graphics.use(this.originalGraphics);
    const outline = new Circle({
      radius: 35,
      color: Color.White,
      strokeColor: Color.Black,
    })
    outline.opacity = 0.5;

    if (!this.valueLabel) {
      this.valueLabel = new Label({
        text: this.binRep,
        font: new Font({
          family: 'Upheaval',
          size: 20,
          color: Color.Black,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle
        })
      });

      this.addChild(this.valueLabel);
    }

    // set piece value
    this.value = pieceDistrib[Math.floor(Math.random()*pieceDistrib.length)] ;
    this.valueLabel.z = 2;
    

    // create the selected graphics with a white outline
    this.selectedGraphics = new GraphicsGroup({
      members :
      [
          {graphic:outline, pos:vec(0,0)},
          {graphic:this.originalGraphics, pos:vec(0,0)}
        ]
    });

  }
  
  outline(){
    this.graphics.use(this.selectedGraphics);
  }
  
  unoutline(){
    this.graphics.use(this.originalGraphics);
  }

  set value(val: number){
    this._value = val;
    let binaryString = val.toString(2);
    
    // Calculate the number of leading zeros needed for padding
    const paddingZeros = Math.max(0, 2 - binaryString.length);
    // Add leading zeros for padding
    this.binRep = "0".repeat(paddingZeros) + binaryString;
    this.valueLabel.text = this.binRep;
  }

  get value(){
    return this._value;
  }


  get forward(){
    if (this.owner){
      return this.owner.forward;
    }
  }



}