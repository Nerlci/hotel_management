import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const config = defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: "./dist/index.js",
        format: "umd",
        name: "shared",
      },
      {
        file: "./dist/index.min.js",
        format: "umd",
        name: "shared",
        plugins: [terser()],
      },
    ],
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "./dist/index.mjs",
      format: "esm",
      name: "shared",
    },
    plugins: [typescript()],
  },
]);

export default config;
