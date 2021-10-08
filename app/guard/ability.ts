import db, { ProjectMemberRole } from "db"
import { GuardBuilder } from "@blitz-guard/core"
import { checkFeedbackSettingsManagePermissions } from "./helpers"

export type ExtendedResourceTypes =
  | "user"
  | "feedback"
  | "feedback.settings"
  | "project"
  | "projects"

export type ExtendedAbilityTypes = "follow"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    const authUserId = ctx.session.userId

    cannot("manage", "all")

    can("read", "user")

    if (authUserId) {
      can("manage", "user")

      // TODO: maybe additional check for private project
      can("follow", "project")

      can(
        "manage",
        "feedback.settings",
        async (slug: string) => await checkFeedbackSettingsManagePermissions(slug, authUserId)
      )

      // const isUserEmailVerified = await checkEmailVerification(ctx);
      // if (isUserEmailVerified) {}
    }
  }
)

export default Guard
