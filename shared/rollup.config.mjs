import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import resolve from "rollup-plugin-node-resolve";

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
      {
        file: "./dist/index.mjs",
        format: "esm",
      },
    ],
    plugins: [typescript(), resolve()],
  },
]);

export default config;
