import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

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
    plugins: [
      typescript(),
      nodeResolve(),
      commonjs(),
      replace({
        "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
        preventAssignment: true,
      }),
    ],
  },
]);

export default config;
