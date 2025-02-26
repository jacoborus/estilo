import { assertEquals } from "@std/assert";
import { isLegacyUi, parseLegacyUi } from "../src/legacy-ui.ts";

Deno.test("isLegacyUi", async (t) => {
  await t.step("recognizes valid legacy UI combinations", () => {
    assertEquals(isLegacyUi("b"), true);
    assertEquals(isLegacyUi("bi"), true);
    assertEquals(isLegacyUi("biu"), true);
    assertEquals(isLegacyUi("biurc"), true);
  });

  await t.step("rejects invalid UI combinations", () => {
    assertEquals(isLegacyUi("bold"), false);
    assertEquals(isLegacyUi("x"), false);
    assertEquals(isLegacyUi("bix"), false);
  });
});

Deno.test("parseLegacyUi", async (t) => {
  await t.step("parses single style", () => {
    assertEquals(parseLegacyUi("b"), "Bold");
    assertEquals(parseLegacyUi("i"), "Italic");
    assertEquals(parseLegacyUi("u"), "underline");
  });

  await t.step("parses multiple styles", () => {
    assertEquals(parseLegacyUi("bi"), "Bold,Italic");
    assertEquals(parseLegacyUi("biu"), "Bold,Italic,underline");
    assertEquals(
      parseLegacyUi("biurc"),
      "Bold,Italic,underline,reverse,undercurl",
    );
  });
});
