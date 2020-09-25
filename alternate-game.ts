import {Set} from "immutable";
import {time, range, isAlive} from "./utils"

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

export const nextGeneration = (ecosystem: Set<Cell>): Set<Cell> => {
  return time(() => ecosystem.reduce((acc, cell) => fateOfCell(cell, ecosystem, acc), emptyEcosystem()))
}

const fateOfCell = (cell: Cell, ecosystem: Set<Cell>, nextEcosystem: Set<Cell>): Set<Cell> => {
  const livingNeighbours = ecosystem.intersect(cell.neighbours())
  
  if (timetoLive(cell, livingNeighbours)) return live(cell, nextEcosystem)
  if (timeToDie(cell, livingNeighbours)) return die(cell, nextEcosystem)
  
  return statusQuo(cell, nextEcosystem)
}

const timetoLive = (cell: Cell, neighbours: Set<Cell>): boolean => {
  return !cell.alive && neighbours.size === 3
}

const timeToDie = (cell: Cell, neighbours: Set<Cell>): boolean => {
  return overcrowded(cell, neighbours) || isolated(cell, neighbours)
}

const statusQuo = (cell: Cell, nextEcosystem: Set<Cell>):  Set<Cell> => {
  return cell.alive ? live(cell, nextEcosystem) : die(cell, nextEcosystem)
}

const overcrowded = (cell: Cell, neighbours: Set<Cell>) => cell.alive && neighbours.size > 3
const isolated = (cell: Cell, neighbours: Set<Cell>) => cell.alive && neighbours.size < 2

const die = (cell: Cell, ecosystem: Set<Cell>): Set<Cell> => ecosystem.add(new Cell(cell.x, cell.y, false));

const live = (cell: Cell, ecosystem: Set<Cell>): Set<Cell> => ecosystem.add(new Cell(cell.x, cell.y, true));

export const emptyEcosystem = (): Set<Cell> => Set<Cell>();

export const seedEcosystem = (width: number, height: number): Set<Cell> => range(height).reduce((acc, _, index) => seedRow(index, width, acc), emptyEcosystem())

const seedRow = (row: number, width: number, initial: Set<Cell>) => {
  return range(width).reduce((acc, _, index) => initial.add(new Cell(row, index, isAlive())), initial)
}