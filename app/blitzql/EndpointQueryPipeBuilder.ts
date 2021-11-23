import { Ctx, QueryNodeTypes, resolver } from "blitz"
import { PrismaClient, Prisma } from "@prisma/client"

function isPromise(promise) {
  return !!promise && typeof promise.then === "function"
}

export type PrismaModelNameKeys = Uncapitalize<Prisma.ModelName>

type QueryMethod = "findFirst" | "findMany" | "findUnique" | "count" | "aggregate" | "groupBy"

type AddQueryResolverProps = {
  query: any
  ctx: Ctx
  prismaQuery: any
}

interface AddQueryProps {
  pipe?: ReturnType<typeof resolver.pipe>
  method: QueryMethod
  model: PrismaModelNameKeys
  fetchResolver?: (resolveProps: AddQueryResolverProps) => any
}

type NodeTree = Record<QueryNodeTypes, AddQueryProps>
export type PrismaQuery = Record<QueryNodeTypes, Object>

interface EndpointQueryPipeBuilderProps {
  prismaClient: PrismaClient
}

type ResolverReturnType<I> = I &
  EndpointQueryPipeBuilderProps & { tree: Partial<NodeTree>; query: PrismaQuery }

interface ResolverPipe {
  <I extends { query: PrismaQuery }>(props: EndpointQueryPipeBuilderProps): (
    input: I
  ) => ResolverReturnType<I>
}

export const resolverPipe: ResolverPipe = (props) => (input) => ({
  ...input,
  ...props,
  tree: {},
})

interface RequiredAddQueryResolverPipeProps {
  prismaClient: PrismaClient
}

interface QueryResolverPipe {
  <I extends RequiredAddQueryResolverPipeProps>(name: QueryNodeTypes, queryProps: AddQueryProps): (
    input: I & ResolverReturnType<I>,
    ctx: Ctx
  ) => ResolverReturnType<I>
}

export const queryResolverPipe: QueryResolverPipe = (name, queryProps) => (input) => {
  input.tree[name] = queryProps

  return input
}

interface FetcherResolverPipe {
  <I>(): (input: I & ResolverReturnType<I>, ctx: Ctx) => Promise<any>
}

export const fetcherResolverPipe: FetcherResolverPipe = () => async (input, ctx) => {
  const { prismaClient, tree, query } = input

  const queries: Partial<Record<QueryNodeTypes, any>> = {}
  const response: Partial<Record<QueryNodeTypes, any>> = {}

  Object.entries(query).forEach(([nodeKey, query]) => {
    const node = tree[nodeKey] as AddQueryProps | undefined

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

// type PrismaDataClient = Omit<
//   PrismaClient,
//   | "$disconnect"
//   | "$connect"
//   | "$on"
//   | "$use"
//   | "$transaction"
//   | "$executeRaw"
//   | "$queryRaw"
//   | "$executeRawUnsafe"
//   | "$queryRawUnsafe"
// >

// type PrismaDataClientQueryInput = Partial<{
//   [modelKey in keyof PrismaDataClient]: Partial<{
//     [operationKey in keyof Pick<
//       PrismaDataClient[modelKey],
//       "findFirst" | "findMany" | "findUnique"
//     >]: Parameters<
//       // @ts-ignore
//       Partial<PrismaDataClient[modelKey][operationKey]>
//     >[0]
//   }>
// }>

// export type PrismaDataClientQuery<N extends string, T extends NodeTree<N> = {}> = {
//   [K in keyof T]?: PrismaClient[T[K]["method"]]
// }

// type MaybePromise<T> = Promise<T> | T
