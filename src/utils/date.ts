
export function getCountdownAsString(restInMs: number): string {
  if (restInMs < 0) {
    return '- ' + getCountdownAsString(-restInMs);
  }
  return Math.floor(restInMs / 1000 / 60 / 60) +
      ':' +
      Math.floor(restInMs / 1000 / 60) +
      ':' +
      addPrefixZeros(Math.floor(restInMs / 1000), 2) +
      '.' +
      addPrefixZeros(restInMs % 1000, 3)
}

function addPrefixZeros(x: number, length: number): string {
  let result = x.toString();
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}
