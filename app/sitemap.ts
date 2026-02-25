import type { MetadataRoute } from "next";

const baseUrl = "https://vigilanzanonarmatailgabbiano.it";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
