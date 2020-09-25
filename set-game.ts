import {Set} from "immutable";
import {time, range, isAlive} from "./utils"

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

export const nextGeneration = (ecosystem: Ecosystem): Ecosystem => {
  return time(() => ecosystem.living.union(ecosystem.dead).reduce((acc, cell) => fateOfCell(cell, ecosystem, acc), emptyEcosystem()))
}

const fateOfCell = (cell: Cell, ecosystem: Ecosystem, nextEcosystem: Ecosystem): Ecosystem => {
  const livingNeighbours = ecosystem.living.intersect(cell.neighbours())
  
  if (timetoLive(cell, livingNeighbours, ecosystem)) return live(cell, nextEcosystem)
  if (timeToDie(cell, livingNeighbours, ecosystem)) return die(cell, nextEcosystem)
  
  return statusQuo(cell, ecosystem, nextEcosystem)
}

const timetoLive = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem): boolean => {
  return ecosystem.dead.has(cell) && neighbours.size === 3
}

const timeToDie = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem): boolean => {
  return overcrowded(cell, neighbours, ecosystem) || isolated(cell, neighbours, ecosystem)
}

const statusQuo = (cell: Cell, ecosystem: Ecosystem, nextEcosystem: Ecosystem): Ecosystem => {
  return ecosystem.living.has(cell) ? live(cell, nextEcosystem) : die(cell, nextEcosystem)
}

const overcrowded = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem) => ecosystem.living.contains(cell) && neighbours.size > 3
const isolated = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem) => ecosystem.living.contains(cell) && neighbours.size < 2

const die = (cell: Cell, ecosystem: Ecosystem): Ecosystem => ({
  living: ecosystem.living,
  dead: ecosystem.dead.add(cell)
})

const live = (cell: Cell, ecosystem: Ecosystem): Ecosystem => ({
  living: ecosystem.living.add(cell),
  dead: ecosystem.dead
})

export const emptyEcosystem = (): Ecosystem => ({
  living: Set<Cell>(),
  dead: Set<Cell>()
})

export const seedEcosystem = (width: number, height: number): Ecosystem => range(height).reduce((acc, _, index) => seedRow(index, width, acc), emptyEcosystem())

const seedRow = (row: number, width: number, initial: Ecosystem) => {
  return range(width).reduce((acc, _, index) => {
    const shouldLive = isAlive()
    return {
      living: shouldLive ? acc.living.add(new Cell(row, index)) : acc.living,
      dead: !shouldLive ? acc.dead.add(new Cell(row, index)) : acc.dead
    }
  }, initial)
}
