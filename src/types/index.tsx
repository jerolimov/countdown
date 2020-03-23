
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

export interface CounterState {
  // Configuration
  countdown: Time,
  thresholds: Time[],

  // Running countdown
  startedAt: Date | null,
  pausedAt: Date | null,
  restTimeInMs: number,
  laps: Lap[],
}
