import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://hotel-management-doc.vercel.app/",
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  },
  integrations: [
    sitemap(),
    starlight({
      title: "酒店管理系统文档",
      social: {
        github: "https://github.com/3DRX/hotel_management",
      },
      sidebar: [
        {
          label: "设计",
          autogenerate: { directory: "design" },
        },
      ],
      customCss: ["./src/assets/katex/katex.min.css", "./src/theme.css"],
    }),
  ],
});
