import { Ctx, QueryNodeTypes, paginate } from "blitz"
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

type QueryArgsHelper<
  MD extends PrismaModelNameKeys,
  MT extends QueryMethod,
  P extends Boolean,
  Params = Parameters<PrismaDataClient[MD][MT]>[0]
> = P extends true ? Partial<Params> : Params

interface AddQueryResolverProps<
  MT extends QueryMethod,
  MD extends PrismaModelNameKeys,
  P extends Boolean
> {
  query: QueryArgsHelper<MD, MT, P>
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
  method: MT
  model: MD
  nullable?: N
  partialQuery?: P
  paginated?: PG
  input?: z.ZodObject<any, any>
  modifyQuery?: <Q extends QueryArgsHelper<MD, MT, P>>(
    query: Q,
    ctx: Ctx
  ) => QueryArgsHelper<MD, MT, P>
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

      // console.log("INPUT", query)

      const queries: Partial<Record<QueryNodeTypes, any>> = {}
      const response: Partial<Record<QueryNodeTypes, any>> = {}

      Object.entries(query).forEach(([nodeKey, query]) => {
        const node = schema[nodeKey] as AddQueryProps<any, any, any, any, any> | undefined

        if (node) {
          const { model, method, fetchResolver, modifyQuery, paginated } = node

          if (modifyQuery) {
            query = modifyQuery(query, ctx) as any
          }

          const prismaQuery = prismaClient[model][method] as any

          let prismaRes = prismaQuery(query)

          if (fetchResolver) {
            prismaRes = fetchResolver?.({ ctx, query, prismaQuery })
          }

          if (isPromise(prismaRes)) {
            if (paginated) {
              prismaRes = paginate({
                take: query!.take as number,
                skip: query!.skip as number,
                count: () =>
                  prismaClient[model].count({
                    where: query!.where as any,
                  }),
                query: (paginateArgs) => prismaQuery({ ...paginateArgs, ...query }),
              })
            }

            queries[nodeKey] = prismaRes
          } else {
            response[nodeKey] = prismaRes
          }
        }
      })

      const transactionData = await Promise.all(Object.values(queries))

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
