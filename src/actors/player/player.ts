import { Component, Engine, Entity, TransformComponent } from 'excalibur';

import {Piece} from "@/actors/piece/piece";

export class Player  {
  forward: number = 1;
  public ownedPieces= []

  constructor(forward: number) {
    this.forward = forward;
  }
  owns(piece: Piece){
    this.ownedPieces.push(piece.id)
  }

  remove(piece: Piece){
    this.ownedPieces = this.ownedPieces.filter(p => p !== piece.id)
  }

  init(engine: Engine) {
  }

}
