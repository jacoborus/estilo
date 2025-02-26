import { assertEquals } from "@std/assert";
import {
  getColorCode,
  getUI,
  getCurlColor,
} from "../src/render-colorscheme.ts";
import type { ColorObj, Palette } from "../src/types.ts";

const mockPalette: Palette = {
  name: "test",
  filepath: "test.yml",
  colors: {
    blue: { hex: "#0000ff", xterm: "12" },
    red: { hex: "#ff0000", xterm: "9" },
  },
};

Deno.test("getColorCode", async (t) => {
  await t.step("returns false for empty color", () => {
    assertEquals(getColorCode(".", mockPalette, "test.yml"), false);
  });

  await t.step("returns NONE for dash or empty string", () => {
    const expected = { hex: "NONE", xterm: "NONE" };
    assertEquals(getColorCode("-", mockPalette, "test.yml"), expected);
    assertEquals(getColorCode("", mockPalette, "test.yml"), expected);
  });

  await t.step("returns color from palette", () => {
    const expected = { hex: "#0000ff", xterm: "12" };
    assertEquals(getColorCode("blue", mockPalette, "test.yml"), expected);
  });

  await t.step("returns direct hex color", () => {
    const result = getColorCode("#123456", mockPalette, "test.yml") as ColorObj;
    assertEquals(result.hex, "#123456");
    assertEquals(typeof result.xterm, "string");
  });
});

Deno.test("getUI", async (t) => {
  await t.step("returns false for dot", () => {
    assertEquals(getUI("."), false);
  });

  await t.step("returns NONE for empty or NONE", () => {
    assertEquals(getUI(""), "NONE");
    assertEquals(getUI("NONE"), "NONE");
  });

  await t.step("parses legacy UI format", () => {
    assertEquals(getUI("bi"), "Bold,Italic");
    assertEquals(getUI("bur"), "Bold,underline,reverse");
  });

  await t.step("returns direct UI value", () => {
    assertEquals(getUI("bold,italic"), "bold,italic");
  });
});

Deno.test("getCurlColor", async (t) => {
  await t.step("returns false for empty color", () => {
    assertEquals(getCurlColor(".", mockPalette, "test.yml"), false);
  });

  await t.step("returns false for NONE", () => {
    assertEquals(getCurlColor("-", mockPalette, "test.yml"), false);
  });

  await t.step("returns color object for valid color", () => {
    const expected = { hex: "#0000ff", xterm: "12" };
    assertEquals(getCurlColor("blue", mockPalette, "test.yml"), expected);
  });
});
