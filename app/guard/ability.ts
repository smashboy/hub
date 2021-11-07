import { GuardBuilder } from "@blitz-guard/core"
import { checkModeratorPersmissions, checkAdminPersmissions } from "./helpers"

export type ExtendedResourceTypes =
  | "user"
  | "user.notifications"
  | "feedback"
  | "feedback.settings"
  | "feedback.messages"
  | "feedback.messages.private"
  | "project"
  | "project.invites"
  | "project.members"
  | "project.labels"
  | "project.roadmap"
  | "project.changelog"
  | "project.changelog.feedback"
  | "project.settings.general"
  | "project.settings.danger"
  | "project.settings.invites"
  | "projects"

export type ExtendedAbilityTypes = "follow" | "upvote" | "accept" | "decline"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    const authUserId = ctx.session.userId

    cannot("manage", "all")

    can("read", "user")
    can("read", "feedback")
    can("read", "project")
    can("read", "feedback.settings")
    can("read", "feedback.messages")

    if (authUserId) {
      can("manage", "user")
      can("manage", "user.notifications")

      can("create", "project")
      // TODO: maybe additional check for private project
      can("follow", "project")

      can("manage", "project.roadmap")

      can(
        "manage",
        "project.labels",
        async (slug: string) => await checkModeratorPersmissions(slug, authUserId)
      )

      can("read", "project.changelog")
      can("create", "project.changelog.feedback")
      can(
        "read",
        "project.changelog.feedback",
        async (slug: string) => await checkModeratorPersmissions(slug, authUserId)
      )

      can(
        "manage",
        "project.changelog",
        async (slug: string) => await checkModeratorPersmissions(slug, authUserId)
      )

      // Feedback
      can("manage", "feedback")
      can("upvote", "feedback")
      can("manage", "feedback.messages")
      can(
        "manage",
        "feedback.messages.private",
        async (slug: string) => await checkModeratorPersmissions(slug, authUserId)
      )

      can(
        "update",
        "feedback.settings",
        async (slug: string) => await checkModeratorPersmissions(slug, authUserId)
      )

      can("accept", "project.invites")
      can("decline", "project.invites")

      can(
        "delete",
        "project",
        async (slug: string) => await checkAdminPersmissions(slug, authUserId)
      )

      can(
        "manage",
        "project.members",
        async (slug: string) => await checkAdminPersmissions(slug, authUserId)
      )

      // Project settings
      // TODO: make managers for each section
      can(
        "manage",
        "project.settings.general",
        async (slug: string) => await checkAdminPersmissions(slug, authUserId)
      )
      can(
        "manage",
        "project.settings.danger",
        async (slug: string) => await checkAdminPersmissions(slug, authUserId)
      )

      can(
        "manage",
        "project.settings.invites",
        async (slug: string) => await checkAdminPersmissions(slug, authUserId)
      )

      // const isUserEmailVerified = await checkEmailVerification(ctx);
      // if (isUserEmailVerified) {}
    }
  }
)

export default Guard
