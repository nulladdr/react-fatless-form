import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  target: "esnext",
  dts: true,
  sourcemap: true,
  clean: true,
  outExtension: ({ format }) =>
    format === "cjs"
      ? { js: ".cjs" }
      : { js: ".mjs" },
});
