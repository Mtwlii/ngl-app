// Time helpers.
// NOTE: "houres" is kept as a backward-compatible alias of "hours".
export function toMs(time, unit) {
  switch (unit) {
    case "seconds":
      return time * 1000;
    case "minutes":
      return time * 60 * 1000;
    case "hours":
    case "houres":
      return time * 60 * 60 * 1000;
    case "days":
      return time * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`toMs: unsupported unit "${unit}"`);
  }
}

export function toSeconds(time, unit) {
  switch (unit) {
    case "milliseconds":
      return time / 1000;
    case "minutes":
      return time * 60;
    case "hours":
    case "houres":
      return time * 60 * 60;
    case "days":
      return time * 24 * 60 * 60;
    default:
      throw new Error(`toSeconds: unsupported unit "${unit}"`);
  }
}
