import { GuardBuilder } from "@blitz-guard/core"
import {
  checkFeedbackSettingsManagePermissions,
  checkGeneralSettingsManagePersmissions,
} from "./helpers"

export type ExtendedResourceTypes =
  | "user"
  | "feedback"
  | "feedback.settings"
  | "project"
  | "project.settings.general"
  | "project.settings.danger"
  | "projects"

export type ExtendedAbilityTypes = "follow"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    const authUserId = ctx.session.userId

    cannot("manage", "all")

    can("read", "user")
    can("read", "feedback")
    can("read", "project")
    can("read", "feedback.settings")

    if (authUserId) {
      can("manage", "user")

      // TODO: maybe additional check for private project
      can("follow", "project")

      // Feedback
      can("create", "feedback")
      can("update", "feedback")

      can(
        "update",
        "feedback.settings",
        async (slug: string) => await checkFeedbackSettingsManagePermissions(slug, authUserId)
      )

      // Project settings
      // TODO: make managers for each section
      can(
        "manage",
        "project.settings.general",
        async (slug: string) => await checkGeneralSettingsManagePersmissions(slug, authUserId)
      )
      can(
        "manage",
        "project.settings.danger",
        async (slug: string) => await checkGeneralSettingsManagePersmissions(slug, authUserId)
      )

      // const isUserEmailVerified = await checkEmailVerification(ctx);
      // if (isUserEmailVerified) {}
    }
  }
)

export default Guard
