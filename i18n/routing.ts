import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en"],
  defaultLocale: "th",
  localePrefix: "never",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 365 * 24 * 60 * 60,
  },
});
