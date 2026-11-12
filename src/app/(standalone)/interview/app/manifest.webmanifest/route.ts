const manifest = {
  id: "/interview/app",
  name: "Interview",
  short_name: "Interview",
  description: "Interview crib sheet for the phone.",
  start_url: "/interview/app",
  scope: "/interview/app/",
  display: "standalone",
  background_color: "#f7f5f0",
  theme_color: "#f7f5f0",
  icons: [
    {
      src: "/interview/app/apple-icon",
      sizes: "180x180",
      type: "image/png",
    },
    {
      src: "/interview/app/icon/192",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/interview/app/icon/512",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

export function GET() {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
