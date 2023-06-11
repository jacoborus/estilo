export function crash(message: string, data?: Record<string, string>): never {
  console.log("Error: " + message, "color: red");

  if (data) {
    console.log(
      "%c" +
        Object.keys(data)
          .map((key) => `- ${key}: ${data[key]}`)
          .join("\n"),
      "color: red",
    );
  }
  Deno.exit(1);
}
