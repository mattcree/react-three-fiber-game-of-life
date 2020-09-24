import {Set} from 'immutable'

export const time = <T>(fn: () => T): T => {
  const before = Date.now();
  const result = fn();
  const after = Date.now();
  console.log("It took " + (after - before) + " ms");
  return result;
}

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
const isAlive = () => Math.round(Math.random()) === 1
const range = (width: number): number[] => Array(width).fill(null)