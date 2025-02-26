import { assertEquals } from "@std/assert";
import { formatSyntax, formatTerminal } from "../src/format-project.ts";
import type { YmlFile, List } from "../src/types.ts";

Deno.test("formatSyntax", async (t) => {
  const mockSyntaxFiles: YmlFile[] = [
    {
      filepath: "test.yml",
      content: {
        Normal: "white black",
        Comment: "gray -",
        Title: "- red bold",
      },
    },
  ];

  await t.step("formats syntax rules correctly", () => {
    const result = formatSyntax(mockSyntaxFiles);
    assertEquals(result.length, 3);
    assertEquals(result[0], {
      filepath: "test.yml",
      name: "Normal",
      rule: "white black",
    });
  });

  await t.step("filters out empty rules", () => {
    const filesWithEmpty: YmlFile[] = [
      {
        filepath: "test.yml",
        content: {
          Normal: "white black",
          Empty: "",
        },
      },
    ];
    const result = formatSyntax(filesWithEmpty);
    assertEquals(result.length, 1);
  });
});

Deno.test("formatTerminal", () => {
  const mockTerminal: List = {
    color_0: "#000000",
    color_1: "#ff0000",
    empty: "",
    color_15: "#ffffff",
  };

  const result = formatTerminal(mockTerminal);
  assertEquals(result.color_0, "#000000");
  assertEquals(result.color_1, "#ff0000");
  assertEquals(result.color_15, "#ffffff");
  assertEquals(result.empty, undefined);
});
