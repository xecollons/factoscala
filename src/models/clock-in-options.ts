export type ClockInOptions = {
  month: number;
  year: number;
  intervals: ClockInOptionsInterval[];
};

export type ClockInOptionsInterval = {
  clock_in: string;
  clock_out: string;
};
