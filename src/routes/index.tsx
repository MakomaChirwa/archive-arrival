import { createFileRoute } from "@tanstack/react-router";
import SheConnectApp from "@/components/SheConnectApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SheConnect — Opportunities for young women" },
      { name: "description", content: "Find bursaries, free learning resources and a supportive community — built mobile-first and low-data." },
      { property: "og:title", content: "SheConnect — Opportunities for young women" },
      { property: "og:description", content: "Find bursaries, free learning resources and a supportive community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SheConnectApp,
});
