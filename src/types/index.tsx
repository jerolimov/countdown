
export interface Time {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

export interface Lap {
  at: Date,
  timeInMs: number,
}
