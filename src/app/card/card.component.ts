import {Component} from '@angular/core';
import {GameComponent} from "../game/game.component";
import {Card, CardType, CardVisual} from "../service/Card";
import {Game} from "../service/Game";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  divStyle(i: number) {
     let s = {'border': '' + i + 'px double black', 'transform': 'rotate(' + (i * 10) + 'deg)'}
    return s
  }

  scale = 1

  editScale(scale: number, card: Card) {
    card.scale = scale
  }

  cardStyle(card: Card) {
  return {'transform': 'scale(' + card.scale + ')', 'z-index': '' + (card.scale * 100)}
  }

  selectedCardStyle(gc: GameComponent) {
    let color = this.isSelectedCard(gc) ? 'white' : gc.game.players[gc.activePlayer].hero.color
    return {'width': '15rem', 'height': '22rem', 'background': '' + color + ''}
  }

  selectedCard(gc: GameComponent) {
    return gc.game.players[gc.activePlayer].selectedCard
  }

  isSelectedCard(gc: GameComponent) {
    return this.selectedCard(gc) != undefined
  }


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

  constructor(public g: GameComponent) {
  }

  protected readonly CardType = CardType;
  protected readonly CardVisual = CardVisual;
}
