import { Ctx, QueryNodeTypes } from "blitz"
import { z } from "zod"
import { PrismaClient, Prisma } from "@prisma/client"

export type PrismaModelNameKeys = Uncapitalize<Prisma.ModelName>
type QueryMethod = "findFirst" | "findMany" | "findUnique" | "count" | "aggregate" | "groupBy"

interface SchemaBuilderProps {
  prismaClient: PrismaClient
}

interface AddQueryResolverProps {
  query: any
  ctx: Ctx
  prismaQuery: any
}

export interface AddQueryProps {
  // pipe?: ReturnType<typeof resolver.pipe>
  method: QueryMethod
  model: PrismaModelNameKeys
  input?: z.ZodObject<any, any>
  fetchResolver?: (resolveProps: AddQueryResolverProps) => any
}

export type Schema = Record<QueryNodeTypes, AddQueryProps>

// TODO: replace with generated schema
type PrismaQuery = Record<QueryNodeTypes, Object>

export default class SchemaBuilder {
  private prismaClient: PrismaClient
  schema: Partial<Schema> = {}

  constructor(props: SchemaBuilderProps) {
    this.prismaClient = props.prismaClient
  }

  addQuery(nodeName: QueryNodeTypes, props: AddQueryProps) {
    this.schema[nodeName] = props
  }

  query<I>() {
    const schema = this.schema
    const prismaClient = this.prismaClient

    return async function (input: I & { query: PrismaQuery }, ctx: Ctx) {
      const { query } = input

      const queries: Partial<Record<QueryNodeTypes, any>> = {}
      const response: Partial<Record<QueryNodeTypes, any>> = {}

      Object.entries(query).forEach(([nodeKey, query]) => {
        const node = schema[nodeKey] as AddQueryProps | undefined

        if (node) {
          const { model, method, fetchResolver } = node

          const prismaQuery = prismaClient[model][method] as any

          let prismaRes = prismaQuery(query)

          if (fetchResolver) {
            prismaRes = fetchResolver?.({ ctx, query, prismaQuery })
          }

          if (isPromise(prismaRes)) {
            queries[nodeKey] = prismaRes
          } else {
            response[nodeKey] = prismaRes
          }
        }
      })

      const transactionData = await prismaClient.$transaction(Object.values(queries))

      Object.keys(query).forEach((nodeKey, index) => {
        const responseNode = response[nodeKey]

        if (responseNode) return

        response[nodeKey] = transactionData[index]
      })

      return response
    }
  }
}

function isPromise(promise) {
  return !!promise && typeof promise.then === "function"
}
