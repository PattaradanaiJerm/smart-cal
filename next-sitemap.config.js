/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://smartcalc.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin", "/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
  },
  alternateRefs: [
    { href: "https://smartcalc.app/th", hreflang: "th" },
    { href: "https://smartcalc.app/en", hreflang: "en" },
  ],
};
