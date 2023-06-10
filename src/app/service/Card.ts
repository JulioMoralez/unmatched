import {FType} from "./character/Fighter";

export enum CardVisual {
  SELECTED, OPPONENT, DISCARD
}
export enum CardType {
  ATTACK, DEFENSE, SCHEME, VERSATILE
}
export class Card {
  name = ""
  cardType: CardType
  value = -1
  fType: FType
  fighterName = ""
  boost = -1
  deckName = ""
  deckCount = -1
  effect = ""
  scale = 1
  immediately = ""
  combat = ""
  after = ""

  constructor(name: string, cardType: CardType, value: number, fType: FType, boost: number, deckCount: number, effect: string, immediately: string, combat: string, after: string) {
    this.name = name
    this.cardType = cardType
    this.value = value
    this.fType = fType
    this.boost = boost
    this.deckCount = deckCount
    this.effect = effect
    this.immediately = immediately
    this.combat = combat;
    this.after = after;
  }

  setFighterName(hero: string, sidekick: string) {
    switch (this.fType) {
      case FType.HERO:
        this.fighterName = hero
        break
      case FType.SIDEKICK:
        this.fighterName = sidekick
        break
      case FType.ALL:
        this.fighterName = "Все"
        break
      default:
        break
    }
  }
}
