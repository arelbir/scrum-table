export type Color =
  | "backlog-blue"
  | "goal-green"
  | "poker-purple"
  | "online-orange"
  | "planning-pink"
  | "value-violet"
  | "yielding-yellow";

export const COLOR_ORDER: Color[] = ["backlog-blue", "goal-green", "value-violet", "online-orange", "planning-pink", "poker-purple", "yielding-yellow"];

export const getColorIndex = (color: Color) => COLOR_ORDER.indexOf(color);
export const getColorForIndex = (index: number, offset = 0) => COLOR_ORDER[(index + offset + COLOR_ORDER.length) % COLOR_ORDER.length];

export const getColorClassName = (color: Color | undefined) => `accent-color__${color ?? COLOR_ORDER[0]}`;

export function formatColorName(input: string): string {
  const labels: Record<string, string> = {
    "backlog-blue": "Backlog Mavi",
    "goal-green": "Hedef Yeşili",
    "value-violet": "Değer Menekşesi",
    "online-orange": "Çevrimiçi Turuncu",
    "planning-pink": "Planlama Pembesi",
    "poker-purple": "Poker Moru",
    "yielding-yellow": "Verim Sarısı",
  };

  if (labels[input]) return labels[input];

  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getRandomColor = () => getColorForIndex(Math.floor(Math.random() * COLOR_ORDER.length));

// assuming the array is like a rainbow spectrum
export const getNextColor = (color: Color) => getColorForIndex(getColorIndex(color), 1);
export const getPreviousColor = (color: Color) => getColorForIndex(getColorIndex(color), -1);

export const needsHighContrast = (color: string | undefined): boolean =>
  color !== undefined && [getColorClassName("backlog-blue"), getColorClassName("poker-purple")].includes(color);
