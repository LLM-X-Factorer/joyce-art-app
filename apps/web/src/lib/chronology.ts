export const TIMELINE_MIN = -600;
export const TIMELINE_MAX = 1900;
export const SCALE_MARKS = [-600, 0, 500, 1000, 1500, 1700, 1900];

export function timelinePosition(year: number): number {
  return Math.max(0, Math.min(100, ((year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100));
}
