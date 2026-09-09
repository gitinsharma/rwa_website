import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Hero placeholders are local SVGs we author ourselves (not
    // user-uploaded), so it's safe to let next/image optimize them. Remove
    // once the placeholders are replaced with real .jpg/.webp photos.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
