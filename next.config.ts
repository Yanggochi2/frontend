import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 브라우저는 같은 출처의 /api/v1로 부르고, 여기서 백엔드(BACKEND_ORIGIN)로 넘긴다.
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN;
    return backend ? [{ source: "/api/v1/:path*", destination: `${backend}/api/v1/:path*` }] : [];
  },
  experimental: {
    // 자동 생성은 요청 안에서 최대 30초(+모델 준비) 걸린다. 프록시 기본 30초에 끊기지 않게 늘린다
    proxyTimeout: 120_000,
  },
};

export default nextConfig;
