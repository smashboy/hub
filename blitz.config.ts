import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import { BlitzGuardMiddleware } from "@blitz-guard/core/dist/middleware"

const config: BlitzConfig = {
  images: {
    domains: ["lwctufdkptquolgqlmoa.supabase.co"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "projecthub",
      isAuthorized: simpleRolesIsAuthorized,
    }),
    BlitzGuardMiddleware({
      excluded: [
        "/api/rpc/login",
        "/api/rpc/logout",
        "/api/rpc/forgotPassword",
        "/api/rpc/resetPassword",
        "/api/rpc/signup",
        "/api/rpc/checkUsername",
        "/api/rpc/checkEmail",
        // "/api/auth/queries/verifyEmail",
        "/api/rpc/getAbility",
        "/api/rpc/getCurrentUser",
      ],
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
