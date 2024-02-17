import { Component, Engine, Entity, TransformComponent } from 'excalibur';
import { Resources } from '@/resources';
import {PieceOwnerComponent} from "@/components/piece-owner-component";

export class Player extends Entity{
  constructor() {
    super();
  }
  onInitialize(engine: Engine) {
    this.addComponent(new PieceOwnerComponent());

  }
}
