import {Space} from "./Space";
import {Battlefield} from "./Battlefield";
import {Player} from "./Player";

export enum GameState {
  EMPTY, NEW_GAME, HERO_PLACES, SIDEKICK_PLACES, TURN, SELECT, ACTION, BATTLE, MANEUVER, MOVEMENT, CHECK_HAND, OPPONENT
}

export class Game {

  state: GameState = GameState.EMPTY
  selectedSpace = -1
  battlefield: Battlefield
  players: Player[] = []
  maxAction = 2
  currentAction = -1

  changeState(state: GameState, activePlayer: number) {
    this.state = state
    Space.resetPickSpace(this, activePlayer)
  }

}
