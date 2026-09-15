/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allows <Image> to load product photos uploaded to /public/uploads
    // and any remote placeholder image hosts used during early development.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" }
    ],
    // The bundled placeholder art in /public/placeholders is SVG. Remove this
    // once real product photography (JPG/PNG/WebP) replaces the placeholders,
    // since allowing SVG has minor XSS considerations for untrusted sources.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment"
  }
};

module.exports = nextConfig;
