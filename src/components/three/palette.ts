/**
 * WebGL materials need concrete colour values (CSS variables are not readable by three.js).
 * These mirror the brand tokens in src/styles.css.
 */
export const SCENE = {
  background: "#080B10",
  carbonSteel: "#3E4652",
  stainless: "#AEB7C2",
  polished: "#D9DFE7",
  graphite: "#1A1E25",
  glass: "#CFEFFF",
  fluid: "#9FE6FF",
  primary: "#2D8CFF",
  highlight: "#54D6FF",
  white: "#F5F7FA",
} as const;
