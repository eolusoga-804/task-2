// Injects crawler-visible metadata from the central app configuration.
import { defineConfig } from "vite";
import { config } from "./src/config.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const socialPreviewUrl = new URL(
  config.seo.socialPreviewPath,
  config.seo.canonicalUrl,
).toString();

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: config.appName,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  description: config.seo.description,
  url: config.seo.canonicalUrl,
  image: socialPreviewUrl,
}).replaceAll("<", "\\u003c");

const metadata = {
  "{{SEO_TITLE}}": escapeHtml(config.seo.title),
  "{{SEO_SITE_NAME}}": escapeHtml(config.appName),
  "{{SEO_DESCRIPTION}}": escapeHtml(config.seo.description),
  "{{SEO_ROBOTS}}": escapeHtml(config.seo.robots),
  "{{SEO_CANONICAL_URL}}": escapeHtml(config.seo.canonicalUrl),
  "{{SEO_OG_LOCALE}}": escapeHtml(config.seo.openGraphLocale),
  "{{SEO_IMAGE_URL}}": escapeHtml(socialPreviewUrl),
  "{{SEO_IMAGE_ALT}}": escapeHtml(config.seo.socialPreviewAlt),
  "{{SEO_JSON_LD}}": structuredData,
};

export default defineConfig({
  plugins: [
    {
      name: "tasks-manager-seo",
      transformIndexHtml(html) {
        return Object.entries(metadata).reduce(
          (result, [placeholder, value]) =>
            result.replaceAll(placeholder, value),
          html,
        );
      },
    },
  ],
});
