import {Set} from "immutable";
import {time, range, isAlive} from "./utils"

interface Ecosystem {
  cells: Set<Cell>
}

export class Cell {
  constructor(public x: number, public y: number, public alive: boolean) {}
  
  public equals(cell: any) {
    if (cell instanceof Cell) return cell.x === this.x && cell.y === this.y && this.alive == cell.alive
    return false
  }

  public hashcode() {
    return ((this.x * 37) + (this.y * 37)) * 3737
  }

  public neighbours(): Set<Cell> {
    return Set.of(
      new Cell(this.x - 1, this.y - 1, true),
      new Cell(this.x, this.y - 1, true),
      new Cell(this.x + 1, this.y - 1, true),
      new Cell(this.x - 1, this.y, true),
      new Cell(this.x + 1, this.y, true),
      new Cell(this.x - 1, this.y + 1, true),
      new Cell(this.x, this.y + 1, true),
      new Cell(this.x + 1, this.y + 1, true)
    )
  }
}

export const nextGeneration = (ecosystem: Ecosystem): Ecosystem => {
  return time(() => ecosystem.cells.reduce((acc, cell) => fateOfCell(cell, ecosystem, acc), emptyEcosystem()))
}

const fateOfCell = (cell: Cell, ecosystem: Ecosystem, nextEcosystem: Ecosystem): Ecosystem => {
  const livingNeighbours = ecosystem.cells.intersect(cell.neighbours())
  
  if (timetoLive(cell, livingNeighbours, ecosystem)) return live(cell, nextEcosystem)
  if (timeToDie(cell, livingNeighbours, ecosystem)) return die(cell, nextEcosystem)
  
  return statusQuo(cell, ecosystem, nextEcosystem)
}

const timetoLive = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem): boolean => {
  return !cell.alive && neighbours.size === 3
}

const timeToDie = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem): boolean => {
  return overcrowded(cell, neighbours, ecosystem) || isolated(cell, neighbours, ecosystem)
}

const statusQuo = (cell: Cell, ecosystem: Ecosystem, nextEcosystem: Ecosystem): Ecosystem => {
  return cell.alive ? live(cell, nextEcosystem) : die(cell, nextEcosystem)
}

const overcrowded = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem) => cell.alive && neighbours.size > 3
const isolated = (cell: Cell, neighbours: Set<Cell>, ecosystem: Ecosystem) => cell.alive && neighbours.size < 2

const die = (cell: Cell, ecosystem: Ecosystem): Ecosystem => ({
  cells: ecosystem.cells.add(cell)
})

const live = (cell: Cell, ecosystem: Ecosystem): Ecosystem => ({
  cells: ecosystem.cells.add(cell)
})

export const emptyEcosystem = (): Ecosystem => ({
  cells: Set<Cell>()
})

export const seedEcosystem = (width: number, height: number): Ecosystem => range(height).reduce((acc, _, index) => seedRow(index, width, acc), emptyEcosystem())

const seedRow = (row: number, width: number, initial: Ecosystem) => {
  return range(width).reduce((acc, _, index) => ({
    cells: initial.cells.add(new Cell(row, index, isAlive()))
  }), initial)
}