import {Component} from "excalibur";
import type {Piece} from "@/actors/piece/piece";


export class PieceOwnerComponent extends Component {
  readonly type: string = "PieceOwnerComponent"
  public ownedPieces : Piece[] = []


  owns(piece: Piece){
    this.ownedPieces.push(piece)
  }

  remove(piece: Piece){
    this.ownedPieces = this.ownedPieces.filter(p => p !== piece)
  }


}