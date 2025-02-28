import { assertEquals, assertExists } from "@std/assert";
import { resolve } from "@std/path";
import { loadProjectFiles } from "../src/load-project.ts";

const SANDBOX_PATH = resolve("test/sandbox");

Deno.test("loadProjectFiles", async (t) => {
  const project = loadProjectFiles(SANDBOX_PATH);

  await t.step("loads project configuration", () => {
    assertExists(project.config);
    assertEquals(project.projectUrl, SANDBOX_PATH);
  });

  await t.step("loads palettes", () => {
    assertExists(project.palettes);
    assertExists(project.palettes.testone);
    assertExists(project.palettes.testtwo);
  });

  await t.step("loads syntax rules", () => {
    assertExists(project.syntax);
    const baseRules = project.baseSyntax.filter((rule) =>
      rule.filepath.endsWith("base.yml"),
    );
    const jsonRules = project.syntax.filter((rule) =>
      rule.filepath.endsWith("json.yml"),
    );
    assertEquals(baseRules.length > 0, true);
    assertEquals(jsonRules.length > 0, true);
  });
});
