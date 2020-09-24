import {Set} from 'immutable';

export interface Ecosystem {
  living: Set<Cell>
  dead: Set<Cell>
}

export class Cell {
  constructor(public x: number, public y: number) {}
  
  public equals(cell: any) {
    if (cell instanceof Cell) return cell.x === this.x && cell.y === this.y
    return false
  }

  public hashcode() {
    return ((this.x * 37) + (this.y * 37)) * 3737
  }

  public neighbours(): Set<Cell> {
    return Set.of(
      new Cell(this.x - 1, this.y - 1),
      new Cell(this.x, this.y - 1),
      new Cell(this.x + 1, this.y - 1),
      new Cell(this.x - 1, this.y),
      new Cell(this.x + 1, this.y),
      new Cell(this.x - 1, this.y + 1),
      new Cell(this.x, this.y + 1),
      new Cell(this.x + 1, this.y + 1)
    )
  }
}

