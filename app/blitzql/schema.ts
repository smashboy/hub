import { GetChangelogFeedback } from "app/project/validations"
import db from "db"
import SchemaBuilder from "./SchemaBuilder"

const builder = new SchemaBuilder({
  prismaClient: db,
})

builder.addQuery("authUser", {
  model: "user",
  method: "findFirst",
  fetchResolver: ({ query, ctx, prismaQuery }) => {
    const authUserId = ctx.session.userId

    if (!authUserId) return null

    return prismaQuery({
      ...query,
      where: { id: ctx.session?.userId || undefined },
    })
  },
})

builder.addQuery("changelogFeedbackList", {
  model: "changelogFeedback",
  method: "findMany",
  input: GetChangelogFeedback,
})

builder.addQuery("projectMember", {
  model: "projectMember",
  method: "findFirst",
})

export default builder
