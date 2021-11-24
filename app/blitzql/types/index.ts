import { PrismaClient, Prisma, User } from "@prisma/client"
import { BlitzqlSchema } from "./blitzqlGeneratedTypes"

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any

type PrismaDataClient = Omit<
  PrismaClient,
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

export type QuerySchema = Partial<{
  [nodeKey in keyof BlitzqlSchema]: Parameters<
    PrismaDataClient[BlitzqlSchema[nodeKey]["model"]][BlitzqlSchema[nodeKey]["method"]]
  >[0]
}>

export type QuerySchemaReturnType = Partial<{
  [nodeKey in keyof BlitzqlSchema]: AsyncReturnType<
    PrismaDataClient[BlitzqlSchema[nodeKey]["model"]][BlitzqlSchema[nodeKey]["method"]]
  >
}>

type Test<T extends Prisma.UserFindUniqueArgs> = Prisma.CheckSelect<
  T,
  any,
  Prisma.Prisma__UserClient<Prisma.UserGetPayload<T> | null>
>

type GetQueryResult<T extends QuerySchema> = {
  [key in keyof T]: AsyncReturnType<
    PrismaDataClient[BlitzqlSchema[key]["model"]][BlitzqlSchema[key]["method"]]
  >
}

function prismaQuery<T extends QuerySchema>(query: T): GetQueryResult<T> {
  return null as any
}

const t = prismaQuery({
  authUser: {
    select: {
      username: true,
    },
  },
  // projectMember: {
  //   select: {
  //     role: true,
  //   },
  // },
})
