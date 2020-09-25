export const time = <T>(fn: () => T): T => {
  const before = Date.now();
  const result = fn();
  const after = Date.now();
  console.log("It took " + (after - before) + " ms");
  return result;
}

export const isAlive = () => Math.round(Math.random()) === 1
export const range = (width: number): number[] => Array(width).fill(null)