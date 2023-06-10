import {Component, Input} from '@angular/core';
import {GameComponent} from "../game/game.component";
import {Card, CardType, CardVisual} from "../service/Card";
import {PlayerType} from "../service/Player";

@Component({
  selector: 'app-card-full',
  templateUrl: './card-full.component.html',
  styleUrls: ['./card-full.component.css']
})
export class CardFullComponent {

  @Input() cardVisual: CardVisual

  constructor(public gc: GameComponent) {
  }

  selectedCardStyle(gc: GameComponent) {
    let player = this.cardVisual == CardVisual.OPPONENT ? PlayerType.OPPONENT : PlayerType.ME
    let color = this.card() ? 'white' : gc.game.players[player].hero.color
    return {'width': '15rem', 'height': '22rem', 'background': '' + color + ''}
  }

  card(): Card | undefined {
    switch (this.cardVisual) {
      case CardVisual.SELECTED:
        return this.gc.game.players[this.gc.activePlayer].selectedCard
      case CardVisual.DISCARD:
        return this.gc.game.players[this.gc.activePlayer].cards.discard.at(-1)
      default:
        return undefined
    }
  }

  // isSelectedCard(gc: ProductComponent) {
  //   return this.card != undefined
  // }

  isEffectText(card: Card | undefined): boolean {
    return (card != undefined) ? card.effect.length > 0 : false
  }

  isImmediatelyText(card: Card | undefined): boolean {
    return (card != undefined) ? card.immediately.length > 0 : false
  }

  isCombatText(card: Card | undefined): boolean {
    return (card != undefined) ? card.combat.length > 0 : false
  }

  isAfterText(card: Card | undefined): boolean {
    return (card != undefined) ? card.after.length > 0 : false
  }

  setCardTypeStyle(c: CardType | undefined) {
    switch (c) {
      case CardType.ATTACK:
        return {'background': 'red', 'color': 'white'}
      case CardType.DEFENSE:
        return {'background': 'blue', 'color': 'white'}
      case CardType.VERSATILE:
        return {'background': 'violet', 'color': 'white'}
      case CardType.SCHEME:
        return {'background': 'yellow', 'color': 'yellow'}
      default:
        return
    }
  }

}
