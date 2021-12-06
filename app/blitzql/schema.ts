import {
  GetChangelogFeedback,
  GetFeedbackContent,
  GetFeedbackMessages,
  ProjectSlugValidation,
} from "app/project/validations"
import db from "db"
import SchemaBuilder from "./SchemaBuilder"

const schema = new SchemaBuilder({
  prismaClient: db,
})

schema.addQuery("authUser", {
  model: "user",
  method: "findFirst",
  nullable: true,
  fetchResolver: ({ query, ctx, prismaQuery }) => {
    const authUserId = ctx.session.userId

    if (!authUserId) return null

    return prismaQuery({
      ...query,
      where: { id: authUserId || undefined },
    })
  },
})

schema.addQuery("authUserNotificationsCounter", {
  model: "notification",
  method: "findMany",
  nullable: true,
  fetchResolver: ({ query, ctx, prismaQuery }) => {
    const authUserId = ctx.session.userId

    if (!authUserId) return null

    return prismaQuery({
      ...query,
      where: {
        ...query?.where,
        userId: authUserId,
      },
    })
  },
})

schema.addQuery("authUserFeedback", {
  model: "projectFeedback",
  method: "findMany",
  paginated: true,
  modifyQuery: (query, ctx) => {
    const authUserId = ctx.session.userId!

    return {
      ...query,
      where: {
        ...query?.where,
        authorId: authUserId,
      },
    }
  },
})

schema.addQuery("authUserProjectsList", {
  model: "project",
  method: "findMany",
  paginated: true,
  modifyQuery: (query, ctx) => {
    const authUserId = ctx.session.userId!

    const AND = query?.where?.AND || []

    return {
      ...query,
      where: {
        ...query?.where,
        AND: [
          // @ts-ignore
          ...AND,
          {
            OR: [
              {
                members: {
                  some: {
                    userId: authUserId,
                  },
                },
              },
              {
                followers: {
                  some: {
                    id: authUserId,
                  },
                },
              },
            ],
          },
        ],
      },
    }
  },
})

schema.addQuery("changelogFeedback", {
  model: "changelogFeedback",
  method: "findMany",
  input: GetChangelogFeedback,
})

schema.addQuery("projectChangelogList", {
  model: "projectChangelog",
  method: "findMany",
  paginated: true,
})

schema.addQuery("projectFeedbackContent", {
  model: "projectFeedbackContent",
  method: "findFirst",
  input: GetFeedbackContent,
})

schema.addQuery("projectFeedbackList", {
  model: "projectFeedback",
  method: "findMany",
  paginated: true,
})

schema.addQuery("projectFeedbackMessage", {
  model: "projectFeedbackMessage",
  method: "findMany",
  input: GetFeedbackMessages,
})

schema.addQuery("project", {
  model: "project",
  method: "findFirst",
  input: ProjectSlugValidation,
})

schema.addQuery("projectMembersList", {
  model: "projectMember",
  method: "findMany",
  input: ProjectSlugValidation,
})

export default schema
