// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const CSP_GENERAL = {
  "default-src": ["'self'"],
  "style-src": ["'unsafe-inline'"],
};
const CSP_DEV = {
  "script-src": ["'unsafe-eval'"],
};
// List retrieved from https://docs.tidio.com/docs/content_security_policy/
const CSP_TIDIO = {
  "connect-src": ["sentry-new.tidio.co", "socket.tidio.co", "api-v2.tidio.co", "https:", "wss:"],
  "font-src": ["fonts.gstatic.com", "https:"],
  "img-src": ["cdnjs.cloudflare.com", "data:", "https:"],
  "media-src": ["widget-v4.tidiochat.com"],
  "script-src": ["'unsafe-inline'", "https://code.tidio.co", "https://widget-v4.tidiochat.com"],
  "style-src": ["'unsafe-inline'", "fonts.googleapis.com", "https:"],
};
function getCSPValue() {
  const combinedDirectives = {};

  function addDirectives(directives) {
    for (const [directive, sources] of Object.entries(directives)) {
      if (!Object.hasOwn(combinedDirectives, directive)) {
        combinedDirectives[directive] = new Set(sources);
      } else {
        sources.forEach((s) => combinedDirectives[directive].add(s));
      }
    }
  }
  function addToEveryDirective(source) {
    Object.keys(combinedDirectives).forEach((k) => combinedDirectives[k].add(source));
  }

  addDirectives(CSP_GENERAL);
  addDirectives(CSP_TIDIO);
  if (process.env.NODE_ENV === "development") {
    addDirectives(CSP_DEV);
  }
  addToEveryDirective("'self'");

  return Object.entries(combinedDirectives)
    .map(([k, v]) => k + " " + [...v].join(" "))
    .join(";");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "null" /* Vercel sets it to * by default, so we want to disable it */,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
        ],
      },
      {
        source: "/img/email/:file*",
        headers: [
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        source: "/:path([^.]*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: getCSPValue(),
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Strict-transport-security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/:path?",
        headers: [
          {
            key: "Cache-Control",
            value: "max-age=86400",
          },
        ],
      },
      {
        source: "/:path([^/]+[^.]*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache",
          },
        ],
      },
      {
        source: "/:path((?:img|font|favicon)/[\\s\\S]+|[^\\/]+(?:\\.ico|\\.webp))",
        headers: [
          {
            key: "Cache-Control",
            value: "max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
  },
  {
    hideSourceMaps: false,
  }
);
