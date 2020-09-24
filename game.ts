import {Set} from "immutable";
import {Cell, Ecosystem} from "./types"
import {time} from "./utils"

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

export const emptyEcosystem = (): Ecosystem => ({
  living: Set<Cell>(),
  dead: Set<Cell>()
})

const isAlive = () => Math.round(Math.random()) === 1
const range = (width: number): number[] => Array(width).fill(null)