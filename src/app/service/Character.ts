import {AttackType, Fighter, FType} from "./character/Fighter";
import {Card, CardType} from "./Card";
import {Game} from "./Game";
import {PlayerType} from "./Player";

export class Character {
  fighters: Fighter[] = []
  cards: Card[] = []
  beforeTurn = function(game: Game, activePlayer: number): void {}

  static Medusa(): Character {
    let character = new Character()

    let hero = Fighter.createFighter("Медуза", 16, FType.HERO, AttackType.RANGED)
    let sidekick = Fighter.createFighter("Гарпия", 1, FType.SIDEKICK, AttackType.MELEE)

    character.fighters = [hero, sidekick].map(f => {
      f.color = "green"
      return f
    })

    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Уловка", CardType.VERSATILE, 2, FType.ALL, 2, 3, "", "Отмените все эффекты карты противника.", "", ""))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Передышка", CardType.VERSATILE, 1, FType.ALL, 2, 3, "", "", "", "Возьмите 1 карту. Если вы победили в бою, вместо этого возьмите 2 карты."))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Меткий выстрел", CardType.VERSATILE, 3, FType.ALL, 1, 3, "", "", "", "Возьмите 1 карту."))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Рывок", CardType.VERSATILE, 3, FType.ALL, 1, 3, "", "", "", "Переместите вашего бойца, участвовавшего в бою, на расстояние до 3 ячеек."))
    for (let i = 0; i < 2; i++)
      character.cards.push(new Card("Гончии могучего зевса", CardType.VERSATILE, 4, FType.SIDEKICK, 3, 2, "", "", "", "Переместите каждую Гарпию на расстояние до 3 ячеек."))
    for (let i = 0; i < 2; i++)
      character.cards.push(new Card("Мимолетный взгляд", CardType.SCHEME, 0, FType.HERO, 4, 2, "Нанесите 2 урона одному любому бойцу в зоне Медузы.", "", "", ""))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Двойной выстрел", CardType.ATTACK, 3, FType.HERO, 3, 3, "", "", "Можете УСИЛИТЬ эту атаку.", ""))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Шипеть и извиваться", CardType.DEFENSE, 4, FType.HERO, 3, 3, "", "", "", "Ваш противник сбрасывает 1 карту."))
    for (let i = 0; i < 2; i++)
      character.cards.push(new Card("Крылатое буйство", CardType.SCHEME, 0, FType.ALL, 2, 2, "Переместите всех ваших бойцов на расстояние до 3 ячеек. Можете перемещать их через ячейки, занятые бойцами противника. Затем верните поверженную Гарпию (если есть) на любую ячейку в зоне Медузы.", "", "", ""))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Мертвая хватка", CardType.VERSATILE, 3, FType.SIDEKICK, 2, 3, "", "", "", "Ваш противник сбрасывает 1 карту."))
    for (let i = 0; i < 3; i++)
      character.cards.push(new Card("Убийственный взор", CardType.ATTACK, 2, FType.HERO, 4, 3, "", "", "", "Если вы победили в бою, нанесите бойцу, которого вы атаковали, 8 единиц урона."))
    character.cards.map(c => {
      c.setFighterName("Медуза", "Гарпии")
      return c
    })

    character.beforeTurn = function(game: Game): void {
      let team = game.players[PlayerType.ME].hero.team
      let spaces = game.battlefield.spaces.filter(s => (s.checkZone(game.players[PlayerType.ME].hero.space)))
      spaces.forEach(s => s.whoOnSpace(game).forEach(f => {
        if (f.team != team) {
          f.hp -= 1
        }
        console.log(f)
      }))
      return }

    return character
  }

  static Sinbad(): Character {
    let character = new Character()
    let hero = Fighter.createFighter("Синбад", 12, FType.HERO, AttackType.MELEE)

    character.fighters = [hero].map(f => {
      f.color = "orange"
      return f
    })
    return character
  }
}
