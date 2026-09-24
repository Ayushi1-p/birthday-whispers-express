import { createFileRoute } from "@tanstack/react-router";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Birthday Surprise" },
      { name: "description", content: "A magical birthday keepsake filled with wishes, memories, and heartfelt letters." },
      { property: "og:title", content: "A Little Birthday Surprise" },
      { property: "og:description", content: "A magical birthday keepsake filled with wishes, memories, and heartfelt letters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BirthdayExperience />;
}
