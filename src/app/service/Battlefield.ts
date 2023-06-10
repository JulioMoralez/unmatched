import {Space} from "./Space";

export class Battlefield {
  name: string = "";
  spaces: Space[] = [];

  constructor(name: string, spaces: Space[]) {
    this.name = name;
    this.spaces = spaces;
  }

  static battlefield1(): Battlefield {
    let spaces: Space[] = []
    spaces.push(new Space(0,500, 100, 80, Array("0", "4")))
    spaces.push(new Space(1,100, 200, 0, Array("0", "4", "3")))
    spaces.push(new Space(2,200, 400, 32, Array("3", "2", "5", "0")))
    spaces.push(new Space(3,500, 400, 32, Array("4")))
    spaces.push(new Space(4,700, 600, 32, Array("5")))
    spaces[0].createLink(spaces[1])
    spaces[0].createLink(spaces[2])
    spaces[0].createLink(spaces[3])
    spaces[2].createLink(spaces[3])
    spaces[3].createLink(spaces[4])
    spaces[1].startedSpace = true
    spaces[4].startedSpace = true
    return new Battlefield("first", spaces)
  }
}
