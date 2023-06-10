import {Point} from "./Point";
import {Zone} from "./Zone";
import {Game, GameState} from "./Game";
import {Figure} from "./character/Figure";
import {CardType} from "./Card";
import {AttackType, FType} from "./character/Fighter";

export class Space {

  id: number
  p0: Point
  radius: number = 50
  numberOfZones = 0
  zones: string[] = []
  colorBorder: string = "black"
  rad = Math.PI / 180
  sector = 0
  shiftAngle = 0
  links: Space[] = []
  startedSpace = false
  pickSpace = false

  constructor(id: number, x0: number, y0: number, shiftAngle: number, zones: string[]) {
    this.id = id
    this.p0 = new Point(x0, y0)
    this.zones = zones
    this.shiftAngle = shiftAngle
    this.numberOfZones = zones.length
    this.sector = 360 / this.numberOfZones
  }

  draw(ctx: CanvasRenderingContext2D, game: Game): void {
    let startSector = this.shiftAngle
    let endSector = this.sector + this.shiftAngle
    let points: Point[] = []

    this.zones.forEach(zone => {
      // круглый сектор ячейки
      ctx.beginPath()
      let maybeColor = Zone.colors.get(zone)
      maybeColor !== undefined ? ctx.fillStyle = maybeColor : ctx.fillStyle = "black"
      ctx.arc(this.p0.x, this.p0.y, this.radius, this.rad * startSector, this.rad * endSector, false)
      ctx.fill()
      ctx.closePath()

      // внутренная часть сектора ячейки
      ctx.beginPath()
      ctx.fillStyle = zone
      ctx.moveTo(this.p0.x, this.p0.y)
      const cosStart = (this.radius + 2) * Math.cos(this.rad * startSector)
      const sinStart = (this.radius + 2) * Math.sin(this.rad * startSector)
      const cosEnd = (this.radius + 2) * Math.cos(this.rad * endSector)
      const sinEnd = (this.radius + 2) * Math.sin(this.rad * endSector)
      points.push(new Point(cosStart, sinStart))
      ctx.lineTo(this.p0.x + cosStart, this.p0.y + sinStart)
      ctx.lineTo(this.p0.x + cosEnd, this.p0.y + sinEnd)
      ctx.fill()
      ctx.closePath()

      startSector = endSector
      endSector += this.sector
    })

    // разделительные линии зон
    if (this.numberOfZones > 1) {
      points.forEach(point => {
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = "white"
        ctx.moveTo(this.p0.x, this.p0.y)
        ctx.lineTo(this.p0.x + point.x, this.p0.y + point.y)
        ctx.stroke()
        ctx.closePath()
      })
    }


    // граница круга
    ctx.beginPath()
    ctx.lineWidth = 10
    if (game.selectedSpace == this.id) {
      ctx.strokeStyle = "orange"
    } else {
      if (this.pickSpace) {
        ctx.strokeStyle = "green"
      } else {
        ctx.strokeStyle = "black"
      }
    }
    ctx.arc(this.p0.x, this.p0.y, this.radius, 0, this.rad * 360, true)
    ctx.stroke()
    ctx.closePath()

    ctx.fillStyle = "orange"
    ctx.font = '48px Arial'
    ctx.fillText(this.id.toString(), this.p0.x, this.p0.y)
  }

  drawLine(ctx: CanvasRenderingContext2D): void {
    this.links.forEach(space => {
      ctx.beginPath()
      ctx.lineWidth = 10
      ctx.strokeStyle = "brown"
      ctx.moveTo(this.p0.x, this.p0.y)
      ctx.lineTo(space.p0.x, space.p0.y)
      ctx.stroke()
      ctx.closePath()
    })
  }

  createLink(space: Space) {
    this.links.push(space)
    space.links.push(this)
  }

  checkOnArea(x: number, y: number): boolean {
    const dx = x - this.p0.x;
    const dy = y - this.p0.y;
    return (Math.sqrt(dx * dx + dy * dy) < this.radius);
  }

  checkZone(space: Space): boolean {
    for (const zone of this.zones) {
      if (space.zones.includes(zone)) {
        return true
      }
    }
    return false
  }

  checkEmptySpace(game: Game) {
    for (const player of game.players) {
      for (const fighter of player.fighters) {
        if ((fighter.space != undefined) && (fighter.space.id == this.id)) {
          return false
        }
      }
    }
    return true
  }

  whoOnSpace(game: Game): Figure[] {
    return game.players.flatMap(p => p.fighters.map(f => <Figure>f).filter(f => f.space != undefined && f.space.id == this.id))
  }

  static resetPickSpace(game: Game, activePlayer: number) {
    game.battlefield.spaces.forEach(s => s.pickSpace = false)
    switch (game.state) {
      case GameState.NEW_GAME:
        game.players[activePlayer].cards.drawCard(game, 5)
        game.changeState(GameState.HERO_PLACES, activePlayer)
        break
      case GameState.HERO_PLACES:
        game.battlefield.spaces.filter(s => (s.startedSpace && s.checkEmptySpace(game))).forEach(s => s.pickSpace = true)
        game.selectedSpace = -1
        break
      case GameState.SIDEKICK_PLACES:
        game.battlefield.spaces.filter(s => (s.checkZone(game.players[activePlayer].hero.space) &&
          (s.checkEmptySpace(game)))).forEach(s => s.pickSpace = true)
        game.selectedSpace = -1
        break
      case GameState.TURN:
        game.currentAction += 1
        game.selectedSpace = -1
        game.players[activePlayer].cards.beforeTurn(game, activePlayer)
        game.players[activePlayer].fighters.forEach(f => {
          f.isMovementInManeuver = false
        })
        break
      case GameState.SELECT:
        game.selectedSpace = -1
        const card = game.players[activePlayer].selectedCard
        if (card) {
          if (card.cardType != CardType.DEFENSE) {
            switch (card.fType) {
              case FType.HERO:
                game.players[activePlayer].hero.space.pickSpace = true
                break
              case FType.SIDEKICK:
                game.players[activePlayer].sidekick.forEach(f => {
                  f.space.pickSpace = true
                })
                break
              case FType.ALL:
                game.players[activePlayer].fighters.forEach(f => {
                  f.space.pickSpace = true
                })
                break
              default:
                break
            }
          }
        }
        break
      case GameState.ACTION:
          let actionFighter = game.players[activePlayer].fighters.filter(f => f.space.id == game.selectedSpace)[0]
          let spacesForRanged: Space[] = []
          if (actionFighter.attackType == AttackType.RANGED) {
            spacesForRanged = game.battlefield.spaces.filter(s => (s.checkZone(actionFighter.space)))
          }
          let spaces = game.battlefield.spaces[game.selectedSpace].links.concat(spacesForRanged)
          spaces.forEach(s => {
            s.whoOnSpace(game).forEach(f => {
              if (f.team != actionFighter.team) {
                s.pickSpace = true
                game.players[activePlayer].battledFighters = [actionFighter, f]
              }
            })
          })
        game.selectedSpace = -1
        break
      case GameState.BATTLE:
        console.log(game.players[activePlayer].battledFighters)
        break
      case GameState.MANEUVER:
        game.players[activePlayer].fighters.filter(f => !f.isMovementInManeuver).forEach(f => {
          f.space.pickSpace = true
        })
        game.selectedSpace = -1
        break
      case GameState.MOVEMENT:
        let fighter = game.players[activePlayer].fighters.filter(f => f.space.id == game.selectedSpace)[0]
        fighter.foundedSpace.clear()
        fighter.findLinkedSpace(fighter.space, 0, [fighter.space.id], game)
        game.battlefield.spaces.filter(s => ((fighter.foundedSpace.has(s.id)) && (s.checkEmptySpace(game)))).forEach(s => s.pickSpace = true)
        game.battlefield.spaces[game.selectedSpace].pickSpace = true
        break
      case GameState.CHECK_HAND:
        const lengthHand = game.players[activePlayer].cards.hand.length
        if (lengthHand <= 7) {
          game.changeState(GameState.OPPONENT, activePlayer)
        } else {
          console.log("!!! hand = " + lengthHand)
        }
        break
      case GameState.OPPONENT:
        game.currentAction = -1
        break
      default:
        break
    }
  }
}
