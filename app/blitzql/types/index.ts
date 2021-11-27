import * as P from "@prisma/client"
import { PickSingleKeyValue } from "app/core/utils/common"
import { BlitzqlInputSchema, BlitzqlOutputSchema } from "./blitzqlGeneratedTypes"

export type PrismaModelNameKeys = Uncapitalize<P.Prisma.ModelName>
export type QueryMethod =
  | "findFirst"
  | "findMany"
  | "findUnique"
  | "count"
  | "aggregate"
  | "groupBy"

export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any

export type MaybePromise<T> = Promise<T> | T

export type PrismaDataClient = Omit<
  InstanceType<typeof P.PrismaClient>,
  | "$disconnect"
  | "$connect"
  | "$on"
  | "$use"
  | "$transaction"
  | "$executeRaw"
  | "$queryRaw"
  | "$executeRawUnsafe"
  | "$queryRawUnsafe"
>

function prismaQuery<T extends Partial<BlitzqlInputSchema>>(query: T): BlitzqlOutputSchema<T> {
  return null as any
}

// Function that accepts queries for multiple models
const res = prismaQuery({
  authUser: {
    select: {
      username: true,
      avatarUrl: true,
    },
  },
})

// And spit out the result base on that query
res.authUser
