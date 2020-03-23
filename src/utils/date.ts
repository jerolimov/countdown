import * as moment from 'moment';

export function getTimeWithMilliseconds(timeInMs: number): string {
  return getTimeWithoutMilliseconds(timeInMs) + '.' + getTimeMilliseconds(timeInMs);
}

export function getTimeWithoutMilliseconds(timeInMs: number): string {
  const duration = moment.duration(Math.abs(timeInMs));

  const showDays = duration.asDays() >= 1;
  const showHours = showDays || duration.hours() > 0;

  return (timeInMs < 0 ? '- ' : '') +
      (showDays ? (Math.floor(duration.asDays()) + 'd ') : '') +
      (showHours ? (addPrefixZeros(duration.hours(), 2) + ':') : '') +
      addPrefixZeros(duration.minutes(), 2) +
      ':' +
      addPrefixZeros(duration.seconds(), 2);
}

export function getTimeMilliseconds(timeInMs: number) {
  return addPrefixZeros(Math.abs(Math.round(timeInMs)) % 1000, 3);
}

function addPrefixZeros(n: number, length: number): string {
  let result = n.toString();
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}
