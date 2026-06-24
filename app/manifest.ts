import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chemistry Unfiltered — সম্পূর্ণ Chemistry Learning Platform",
    short_name: "Chemistry Unfiltered",
    description:
      "Chemistry শেখো সহজে। Interactive Periodic Table, Formula Library, Virtual Lab, Calculator, Question Bank — সব এক জায়গায়।",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f172a",
    theme_color: "#4f46e5",
    lang: "bn",
    categories: ["education", "reference"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
