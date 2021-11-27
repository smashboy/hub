import { Ctx, QueryNodeTypes } from "blitz"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import {
  AsyncReturnType,
  MaybePromise,
  PrismaDataClient,
  PrismaModelNameKeys,
  QueryMethod,
} from "./types"

interface SchemaBuilderProps {
  prismaClient: PrismaClient
}

interface AddQueryResolverProps<
  MT extends QueryMethod,
  MD extends PrismaModelNameKeys,
  P extends Boolean
> {
  query: P extends true
    ? Partial<Parameters<PrismaDataClient[MD][MT]>[0]>
    : Parameters<PrismaDataClient[MD][MT]>[0]
  ctx: Ctx
  prismaQuery: PrismaDataClient[MD][MT]
}

export interface AddQueryProps<
  MT extends QueryMethod,
  MD extends PrismaModelNameKeys,
  N extends Boolean,
  P extends Boolean,
  PG extends Boolean
> {
  // pipe?: ReturnType<typeof resolver.pipe>
  method: MT
  model: MD
  nullable?: N
  partialQuery?: P
  paginated?: PG
  input?: z.ZodObject<any, any>
  fetchResolver?: (
    resolveProps: AddQueryResolverProps<MT, MD, P>
  ) => MaybePromise<
    N extends true
      ? AsyncReturnType<PrismaDataClient[MD][MT]> | null
      : NonNullable<AsyncReturnType<PrismaDataClient[MD][MT]>>
  >
}

export type Schema = Record<QueryNodeTypes, AddQueryProps<any, any, any, any, any>>

// TODO: replace with generated schema
type PrismaQuery = Record<QueryNodeTypes, Object>

export default class SchemaBuilder {
  private prismaClient: PrismaClient
  schema: Partial<Schema> = {}

  constructor(props: SchemaBuilderProps) {
    this.prismaClient = props.prismaClient
  }

  addQuery<
    MT extends QueryMethod,
    MD extends PrismaModelNameKeys,
    N extends Boolean,
    P extends Boolean,
    PG extends Boolean
  >(nodeName: QueryNodeTypes, props: AddQueryProps<MT, MD, N, P, PG>) {
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
        const node = schema[nodeKey] as AddQueryProps<any, any, any, any, any> | undefined

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

  mutation() {}
}

function isPromise(promise) {
  return !!promise && typeof promise.then === "function"
}
