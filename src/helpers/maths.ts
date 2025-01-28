export const getBaseLog = (val: number, base: number) => {
  return Math.log(val) / Math.log(base);
}

export const uptoFixed = (val: number, digits: number = 2) => {
  return Math.round(val * (10 ** digits)) / (10 ** digits);
}
