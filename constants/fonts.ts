export const MONO_FONTS = [
  "Atkinson",
  "Azeret",
  "B612",
  "Cousine",
  "Firacode",
  "Fragment",
  "Inconsolata",
  "JetBrains",
  "Libertinus",
  "Oxygen",
  "Reddit",
  "Ubuntu",
  "Xanh",
] as const;

export type MonoFontFamily = (typeof MONO_FONTS)[number];
