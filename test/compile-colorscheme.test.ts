import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { getColorCode as gcc, getUI } from "../src/render-colorscheme.ts";

Deno.test("getColorCode:", () => {
  const palette = {
    azul: ["#bbddff", 333],
  };

  assertEquals(gcc()[0], "NONE", "empty");

  assertEquals(gcc("-")[0], "NONE", "ommited (hex)");
  assertEquals(gcc("-")[1], "NONE", "ommited (term)");

  assertEquals(gcc("."), false, "empty dot (.)");

  assertEquals(gcc("azul", palette)[0], "#bbddff", "hex from palette");
  assertEquals(gcc("azul", palette)[1], 333, "term from palette");

  assertEquals(gcc("#aabbcc", palette)[0], "#aabbcc", "hex from hex value");
  assertEquals(gcc("#aabbcc", palette)[1], 146, "term from hex value");

  assertThrows(
    () => gcc(3, palette, "part", "schemaName"),
    /wrong part in schemaName/,
  );
});

Deno.test("getUI", () => {
  assertEquals(getUI(), "NONE", "empty value (undefined)");
  assertEquals(getUI("."), false, "empty value (dot)");
  assertThrows(
    () => getUI(1, "schemaName"),
    /wrong ui in schemaName/,
    // "throws on bad type",
  );
  assertEquals(getUI("NONE"), "NONE", "NONE");
  assertEquals(getUI("br"), "Bold,reverse", "valid formatted");
  assertEquals(getUI("bu"), "Bold,underline", "valid formatted");
  assertEquals(getUI("uir"), "underline,Italic,reverse", "valid formatted");
  assertEquals(getUI("c"), "undercurl", "valid formatted");

  assertThrows(
    () => getUI("aui", "schemaName"),
    /wrong ui in schemaName/,
    // "throws on bad type",
  );
});

Deno.test("parseString:", () => {
  const palette = {
    rojo: ["#ff5555", 203],
  };

  const noValue = pss("     ");
  assertEquals(Object.keys(noValue).length, 0, "empty schema");

  const full = pss("#bbddff rojo bi", palette);
  assertEquals(full.fore[0], "#bbddff", "full hex foreground");
  assertEquals(full.fore[1], 153, "full term foreground");
  assertEquals(full.back[0], "#ff5555", "full hex background");
  assertEquals(full.back[1], 203, "full term background");
  assertEquals(full.ui, "Bold,Italic", "full gui");
  assertEquals(full.guisp, false, "full guisp");

  const two = pss("- rojo", palette);
  assertEquals(two.fore[0], "NONE", "two hex foreground");
  assertEquals(two.fore[1], "NONE", "two hex foreground");
  assertEquals(two.back[0], "#ff5555", "two hex background");
  assertEquals(two.back[1], 203, "two hex background");
  assertEquals(two.ui, "NONE", "two gui");
  assertEquals(two.guisp, false, "two guisp");

  const empty = pss(". . bu", palette);
  assertEquals(empty.fore, false, "empty with foreground");
  assertEquals(empty.back, false, "empty with background");
  assertEquals(empty.ui, "Bold,underline", "empty with gui");

  const linked = pss("@other", palette);
  assertEquals(linked.link, "other", "linked link");
  assertEquals(!!linked.fore, false, "linked foreground");
  assertEquals(!!linked.back, false, "linked background");
  assertEquals(!!linked.ui, false, "linked gui");
});

const palette = {
  azul: "#bbddff",
};

Deno.test("compile colorscheme: throws on missing data", () => {
  assertThrows(
    () => renderColorscheme(),
    /wrong highlights object/,
  );
});

Deno.test("compile colorscheme: format hilinks", () => {
  const templates = {
    normal: "#bbddff . birucs",
  };
  const hilinks = renderColorscheme(templates, palette);

  const normal = hilinks.normal;
  assertEquals(normal.fore[0], "#bbddff", "hex foreground");
  assertEquals(normal.fore[1], 153, "term foreground");
  assertEquals(normal.back, false, "background");
  assertEquals(
    normal.ui,
    "Bold,Italic,reverse,underline,undercurl,standout",
    "ui",
  );
});

Deno.test("compile colorscheme: link styles", () => {
  const templates = {
    normal: "@other",
  };
  const hilinks = renderColorscheme(templates, palette);

  const normal = hilinks.normal;
  assertEquals(normal.link, "other");
  assertEquals(!!normal.fore, false, "no fore");
  assertEquals(!!normal.back, false, "no back");
  assertEquals(!!normal.ui, false, "no ui");
});
