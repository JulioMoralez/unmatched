import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {interval} from "rxjs";
import {Battlefield} from "../service/Battlefield";
import {Space} from "../service/Space";
import {Game, GameState} from "../service/Game";
import {Figure} from "../service/character/Figure";
import {Player, PlayerType} from "../service/Player";
import {Fighter} from "../service/character/Fighter";
import {Card, CardType, CardVisual} from "../service/Card";
import {Character} from "../service/Character";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('cnv', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

  game: Game
  activePlayer = 0
  opponentPlayer = 1

  constructor() {

  }

  // sub!: Subscription;
  globalCount = 0;

  b = false
  maxAreaX = 1000
  maxAreaY = 700

  figures: Figure[] = [] // для теста

  ngOnInit(): void {
    console.log("start")
    this.canvas.nativeElement.style.width = `${this.maxAreaX}px`
    this.canvas.nativeElement.style.height = `${this.maxAreaY}px`
    const scale = window.devicePixelRatio
    this.canvas.nativeElement.width = Math.floor(this.maxAreaX * scale);
    this.canvas.nativeElement.height = Math.floor(this.maxAreaY * scale);


    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      console.log("start2")
      // ctx.fillRect(20, 20, this.maxAreaX, this.maxAreaY)
      this.start(ctx);
    }
  }

  start(ctx: CanvasRenderingContext2D) {
    this.newGame()

    // this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // if (this.sub !== null) {
    //   this.sub.unsubscribe();
    // }
    interval(100).subscribe(() => {
      this.globalCount++;
      this.refreshCanvas(ctx);
    })
  }

  private refreshCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // ctx.fillRect(20, 20, 50 + this.globalCount, 200)
    this.game.battlefield.spaces.forEach(space => space.drawLine(ctx))
    this.game.battlefield.spaces.forEach(space => space.draw(ctx, this.game))
    this.game.players.forEach(player => player.fighters.forEach(f => f.draw(ctx, this.game)))
  }

  menuButton1(): string {
    return 'btn btn-info my-2 my-sm-0 mx-1 bs0';
  }

  newGame() {
    this.game = new Game()
    this.game.battlefield = Battlefield.battlefield1()
    this.game.players.push(new Player(Character.Medusa(), 0))
    this.game.players.push(new Player(Character.Sinbad(), 1))
    this.game.players[1].fighters[0].space = this.game.battlefield.spaces[3]

    this.game.changeState(GameState.NEW_GAME, this.activePlayer)
  }

  action() {
    if ((this.game.state == GameState.HERO_PLACES) && (this.game.selectedSpace != -1)) {
      this.game.players[this.activePlayer].hero.space = this.game.battlefield.spaces[this.game.selectedSpace] //TODO players[0]
      if (this.game.players[this.activePlayer].sidekick.length > 0) {
        this.game.changeState(GameState.SIDEKICK_PLACES, this.activePlayer)
      } else {
        this.game.changeState(GameState.TURN, this.activePlayer)
      }
      return
    }
    if ((this.game.state == GameState.SIDEKICK_PLACES) && (this.game.selectedSpace != -1)) {
      for (const s of this.game.players[this.activePlayer].sidekick) {
        if (s.space == undefined) {
          s.space = this.game.battlefield.spaces[this.game.selectedSpace]
          break
        }
      }
      if (this.game.players[this.activePlayer].sidekick.filter(s => s.space == undefined).length == 0) {
        this.game.changeState(GameState.TURN, this.activePlayer)
        return
      }
      Space.resetPickSpace(this.game, this.activePlayer)
      return
    }
    if ((this.game.state == GameState.TURN) || (this.game.state == GameState.MANEUVER) || ((this.game.state == GameState.MOVEMENT))) {
      if (this.game.currentAction < this.game.maxAction) {
        this.game.currentAction += 1
        this.game.players[this.activePlayer].cards.drawCard(this.game, 1)
        this.game.players[this.activePlayer].fighters.forEach(f => f.isMovementInManeuver = false)
        this.game.changeState(GameState.MANEUVER, this.activePlayer)
      } else {
        this.game.changeState(GameState.CHECK_HAND, this.activePlayer)
      }
      return
    }
    if (this.game.state == GameState.CHECK_HAND) {
      this.game.changeState(GameState.CHECK_HAND, this.activePlayer)
      return
    }
  }

  mouseUp($event: MouseEvent) {
    const x = $event.offsetX;
    const y = $event.offsetY;
    switch ($event.button) {
      case 0: {
        for (const space of this.game.battlefield.spaces) {
          if ((space.pickSpace) && (space.checkOnArea(x, y))) {
            this.game.selectedSpace = space.id
            if (this.game.state == GameState.MANEUVER) {
              this.game.players[this.activePlayer].selectedFighter = this.game.selectedSpace
              this.game.changeState(GameState.MOVEMENT, this.activePlayer)
            } else {
              if (this.game.state == GameState.MOVEMENT) {
                let f = this.game.players[this.activePlayer].fighters.filter(f => f.space.id == this.game.players[this.activePlayer].selectedFighter)
                if (f.length > 0) {
                  if (f[0].space.id != this.game.selectedSpace) {
                    f[0].space = this.game.battlefield.spaces[this.game.selectedSpace]
                    f[0].isMovementInManeuver = true
                  }
                }
                this.game.changeState(GameState.MANEUVER, this.activePlayer)
              }
            }
            break
          }
        }
        break;
      }
      case 2: {
        // if (selectedSpace !== undefined) {
        //   let figure = new Figure()
        //   figure.space = selectedSpace
        //   this.figures.push(figure)
        //   figure.findLinkedSpace(figure.space, 0, [figure.space.id])
        //   figure.foundedSpace.forEach(f => console.log(f.toString()))
        // }
        // break;
      }
    }
  }

  test() {
    // this.game.battlefield.spaces[1].whoOnSpace(this.game).forEach(f => console.log(f.hp))
    this.game.players[this.activePlayer].cards.discard.forEach(c => console.log(c.name))
  }

  discardCard() {
    const card = this.game.players[this.activePlayer].selectedCard
    if (card != undefined) {
      this.game.players[this.activePlayer].cards.discardCard(card)
      this.game.players[this.activePlayer].cards.discard.forEach(c => console.log(c.name))
      this.game.players[this.activePlayer].selectedCard = undefined
    }
  }

  actionCard() {
    const card = this.game.players[this.activePlayer].selectedCard
    if (card && card.cardType != CardType.DEFENSE && this.game.currentAction < this.game.maxAction) {
      switch (this.game.state) {
        case GameState.SELECT:
          this.game.changeState(GameState.ACTION, this.activePlayer)
          break
        case GameState.ACTION:
          this.game.changeState(GameState.BATTLE, this.activePlayer)
          break
        case GameState.BATTLE:
          this.discardCard()
          this.game.changeState(GameState.TURN, this.activePlayer)
          break
        default:
          this.game.changeState(GameState.SELECT, this.activePlayer)
          break
      }
    }
  }

  opponentAction() {
    switch (this.game.state) {
      case GameState.OPPONENT:
        this.game.changeState(GameState.TURN, this.activePlayer)
        break
      default:
        break
    }
  }

  selectCard(card: Card) {
    this.game.players[this.activePlayer].selectedCard = card
  }

  actionVisualStyle(i: number) {
    let color = i < this.game.currentAction ? "red" : "green"
    return {'background': '' + color + ''}
  }

  centerTextStyle(p: number) {
    let color = this.game.players[p].hero.color
    return {'background': '' + color + '', 'border-radius': '50%', 'height': '50px', 'width': '50px', 'position': 'relative'}
  }

  centerTextStyleP() {
    return {'top': '50%', 'left': '50%', 'position': 'absolute',  'margin-right': '-50%', 'transform': 'translate(-50%, -50%)', 'font-size': '16pt', 'color': 'white'}
  }

  protected readonly CardVisual = CardVisual;
  protected readonly GameState = GameState;
  protected readonly PlayerType = PlayerType;
}
