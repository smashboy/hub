import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import { BlitzGuardMiddleware } from "@blitz-guard/core/dist/middleware"
import GenerateSchemaTypesPlugin from "app/blitzql/GenerateSchemaTypesPlugin"

const config: BlitzConfig = {
  images: {
    domains: ["lwctufdkptquolgqlmoa.supabase.co"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  log: {
    level: "warn",
  },
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
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

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    config.plugins.push(new GenerateSchemaTypesPlugin())

    return config
  },
}
module.exports = config
