import db, { ProjectMemberRole } from "db"
import { Ctx, AuthorizationError } from "blitz"
import { AbilityType, ResourceType, GuardAuthorizationError } from "@blitz-guard/core"
import Guard from "./ability"
import { ExtendedAbilityTypes, ExtendedResourceTypes } from "./ability"

export const checkEmailVerification = async (ctx: Ctx) => {
  const user = await db.user.findFirst({
    where: {
      id: ctx.session.userId!,
    },
    select: {
      isEmailVerified: true,
    },
  })

  return user!.isEmailVerified
}

export const checkFeedbackSettingsManagePermissions = async (slug: string, userId: number) => {
  const member = await db.projectMember.findFirst({
    where: {
      AND: [
        {
          project: {
            slug,
          },
        },
        {
          userId,
        },
      ],
    },
    select: {
      role: true,
    },
  })

  if (!member) return false

  return member.role !== ProjectMemberRole.FOLLOWER
}

export const checkGeneralSettingsManagePersmissions = async (slug: string, userId: number) => {
  const member = await db.projectMember.findFirst({
    where: {
      AND: [
        {
          project: {
            slug,
          },
        },
        {
          userId,
        },
      ],
    },
    select: {
      role: true,
    },
  })

  if (!member) return false

  return member.role === ProjectMemberRole.ADMIN || member.role === ProjectMemberRole.FOUNDER
}

export interface IAuthorizePipe {
  <I>(
    ability: AbilityType<ExtendedAbilityTypes>,
    resource: ResourceType<ExtendedResourceTypes>,
    args?: (input: I) => any
  ): (input: I, ctx: Ctx) => Promise<I>
}

export const authorizePipe: IAuthorizePipe = (ability, resource, args) => async (input, ctx) => {
  const { can, reason } = await Guard.can(ability, resource, ctx, args?.(input))

  if (!can) throw new AuthorizationError(reason)

  return input
}
