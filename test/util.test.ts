import { assertEquals } from "https://deno.land/std@0.163.0/testing/asserts.ts";
import { isHexColor } from "../src/util.ts";

Deno.test("isHexColor recognizes 3 characters color codes", () => {
  assertEquals(isHexColor("#333"), true);
  assertEquals(isHexColor("#abc"), true);
  assertEquals(isHexColor("333"), false);
  assertEquals(isHexColor("#abc#"), false);
  assertEquals(isHexColor("ab"), false);
  assertEquals(isHexColor("abcd"), false);
});

Deno.test("isHexColor recognizes 6 characters color codes", () => {
  assertEquals(isHexColor("#333def"), true);
  assertEquals(isHexColor("#abc123"), true);
  assertEquals(isHexColor("abc123"), false);
  assertEquals(isHexColor("#abc#88"), false);
});
