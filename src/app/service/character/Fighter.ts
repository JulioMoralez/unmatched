import {Figure} from "./Figure";

export enum FType {
  HERO, SIDEKICK, ALL
}

export enum AttackType {
  MELEE, RANGED
}

export class Fighter extends Figure{

  static createFighter(name: string, hp: number, ftype: FType, attackType: AttackType) {
    let fighter = new Fighter()
    fighter.hp = hp
    fighter.name = name
    fighter.ftype = ftype
    fighter.attackType = attackType
    switch (ftype) {
      case FType.HERO:
        fighter.radius = 20
        break
      case FType.SIDEKICK:
        fighter.radius = 10
        break
      default:
        break
    }
    return fighter
  }
}
