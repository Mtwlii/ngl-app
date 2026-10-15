//For hunde Time
export function toMs(time, unit) {
  switch (unit) {
    case "seconds":
      return time * 1000;
    case "minutes":
      return time * 60 * 1000;
    case "houres":
      return time * 60 * 60 * 1000;

    default:
      return time;
  }
}

export function toSeconds(time, unit) {
  switch (unit) {
    case "milliseconds":
      return time / 1000;
    case "minutes":
      return time * 60;
    case "houres":
      return time * 60 * 60;
    default:
      return time;
  }
}
