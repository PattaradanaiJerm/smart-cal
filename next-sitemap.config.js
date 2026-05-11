/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://d-calc.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin", "/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
  },
  alternateRefs: [
    { href: "https://d-calc.vercel.app/th", hreflang: "th" },
    { href: "https://d-calc.vercel.app/en", hreflang: "en" },
  ],
};
