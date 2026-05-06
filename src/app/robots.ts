import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/privacy", "/auth"],
      // Disallow crawling of any subdirectories that represent dynamic user dashboards (e.g. /[userId]/jobs)
      disallow: ["/[userId]/*", "/api/*"],
    },
    sitemap: "https://jobtrack.pratikgoswami.dev/sitemap.xml",
  };
}
