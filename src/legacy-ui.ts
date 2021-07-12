type UiStyle = "u" | "b" | "r" | "i" | "c" | "s";

const uis = new Set(["u", "b", "r", "i", "c", "s"]);
const uiValues = {
  u: "underline",
  b: "Bold",
  i: "Italic",
  r: "reverse",
  c: "undercurl",
  s: "standout",
};

export function isLegacyUi(value: string): boolean {
  return !value.split("").some((character) => {
    return !uis.has(character);
  });
}

export function parseLegacyUi(style: string) {
  return (style.split("") as UiStyle[]).map((val) => uiValues[val]).join(",");
}
