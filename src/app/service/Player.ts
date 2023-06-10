import {Fighter, FType} from "./character/Fighter";
import {Card} from "./Card";
import {Deck} from "./Deck";
import {Character} from "./Character";

export enum PlayerType {
  ME, OPPONENT
}

export class Player {
  name = ""
  fighters: Fighter[] = []
  hero: Fighter
  sidekick: Fighter[] = []
  selectedFighter = -1
  cards: Deck = new Deck()
  selectedCard: Card | undefined = undefined
  battledFighters: Fighter[] = []

  constructor(character: Character, team: number) {
    this.fighters = character.fighters;
    this.hero = character.fighters.filter(f => f.ftype == FType.HERO)[0]
    this.sidekick = character.fighters.filter(f => f.ftype == FType.SIDEKICK)
    this.fighters.forEach(f => f.team = team)
    this.cards.deck = Deck.shuffle(character.cards)
    this.cards.beforeTurn = character.beforeTurn
  }
}
