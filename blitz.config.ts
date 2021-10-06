import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import { BlitzGuardMiddleware } from "@blitz-guard/core/dist/middleware"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "projecthub",
      isAuthorized: simpleRolesIsAuthorized,
    }),
    BlitzGuardMiddleware({
      excluded: [
        "/api/auth/mutations/login",
        "/api/auth/mutations/logout",
        "/api/auth/mutations/forgotPassword",
        "/api/auth/mutations/resetPassword",
        "/api/auth/mutations/signup",
        "/api/auth/mutations/checkUsername",
        "/api/auth/mutations/checkEmail",
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
