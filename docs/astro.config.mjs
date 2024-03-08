import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  markdown: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: [["rehype-katex", { strict: false }]],
  },
  integrations: [
    starlight({
      title: "酒店管理系统",
      social: {
        github: "https://github.com/3DRX/hotel_management",
      },
      sidebar: [
        {
          label: "设计",
          autogenerate: { directory: "design" },
        },
      ],
      customCss: [
        "./public/katex.min.css",
      ]
    }),
  ],
});
