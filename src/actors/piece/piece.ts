import {Actor, GraphicsGroup, Circle, Engine, vec, Color, Sprite, Shape} from "excalibur";
import {Resources} from "@/resources";
import {Player} from "@/actors/player/player";

export class Piece extends Actor{
  private selectedGraphics: GraphicsGroup;
  private originalGraphics: Sprite;
  _value: number = 1;
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

    this.z = 9;
    this.originalGraphics = Resources.Piece.toSprite();
    this.originalGraphics.scale = vec(0.5,0.5);
    this.graphics.use(this.originalGraphics);
    const outline = new Circle({
      radius: 35,
      color: Color.White,
      strokeColor: Color.Black,
    })
    outline.opacity = 0.5;


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
    this.binRep = val.toString(2);
  }

  get value(){
    return this._value;
  }
}