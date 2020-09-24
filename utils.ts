export const time = <T>(fn: () => T): T => {
  const before = Date.now();
  const result = fn();
  const after = Date.now();
  console.log("It took " + (after - before) + " ms");
  return result;
}
