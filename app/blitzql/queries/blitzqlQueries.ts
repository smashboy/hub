import db from "db"
import { resolver } from "blitz"
import Guard from "app/guard/ability"
import { authorizePipe } from "app/guard/helpers"
import { GetChangelogFeedback, GetFeedbackContent } from "app/project/validations"
import {
  resolverPipe,
  queryResolverPipe,
  fetcherResolverPipe,
  PrismaModelNameKeys,
} from "../EndpointQueryPipeBuilder"

type QueryNodeTypes = "authUser" | "changelogFeedbackList" | PrismaModelNameKeys

// const test = buildQueryPipe<QueryNodeTypes>({
//   prismaClient: db,
// })
//   .addQuery("authUser", {
//     model: "user",
//     method: "findUnique",
//     queryBuilder: ({ query, ctx }) => ({
//       ...query,
//       where: { id: ctx.session.userId },
//     }),
//   })
//   .addQuery("projectFeedback", {
//     model: "projectFeedback",
//     method: "findFirst",
//     pipe: resolver.pipe(resolver.zod(GetFeedbackContent), Guard.authorizePipe("read", "feedback")),
//   })
//   .getQuerySchema()

export default resolver.pipe(
  resolverPipe({
    prismaClient: db,
  }),
  queryResolverPipe("authUser", {
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
  }),
  queryResolverPipe("projectFeedback", {
    model: "projectFeedback",
    method: "findFirst",
  }),
  fetcherResolverPipe(),
  (response) => response
)

// usePrismaQuery({
//   authUser: {
//     select: {
//       id: true,
//       name: true
//     }
//   }
// })
