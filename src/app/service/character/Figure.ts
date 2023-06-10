import {Space} from "../Space";
import {Game} from "../Game";
import {AttackType, FType} from "./Fighter";

export class Figure {
  space: Space
  radius = 20
  rad = Math.PI / 180
  maxSpeed = 2
  foundedSpace: Set<number> = new Set<number>()
  hp: number = -1
  color = "white"
  isMovementInManeuver = false
  team = -1
  name = ""
  ftype: FType
  attackType: AttackType

  findLinkedSpace(space: Space, move: number, prevIds: number[], game: Game) {
    this.foundedSpace.add(space.id)
    console.log("find " + move + " ! " + space.id + " ! " + space.links.map(x => x.id).toString() + " ! " + prevIds.toString())
    if (move < this.maxSpeed) {
      space.links.forEach(s => {
        let ourTeam = true
        for (const t of s.whoOnSpace(game).map(f => f.team)) {
          if (t != this.team) {
            ourTeam = false
            break
          }
        }
        if ((!prevIds.includes(s.id)) && (ourTeam)) {
          let newArray: number[] = Object.assign([], prevIds)
          newArray.push(s.id)
          this.findLinkedSpace(s, move + 1, newArray, game)
        }
      })
    }
  }

  draw(ctx: CanvasRenderingContext2D, game: Game): void {
    if (this.space !== undefined) {
      ctx.beginPath()
      ctx.lineWidth = 6
      ctx.fillStyle = "white"
      ctx.strokeStyle = this.color
      ctx.arc(this.space.p0.x, this.space.p0.y, this.radius, 0, this.rad * 360, true)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
    }
  }
}
