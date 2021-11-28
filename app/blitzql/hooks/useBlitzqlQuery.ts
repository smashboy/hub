import {
  useQuery as useBlitzQuery,
  useInfiniteQuery as useBlitzInfiniteQuery,
  usePaginatedQuery as useBlitzPaginatedQuery,
} from "blitz"
import { UseQueryOptions, UseInfiniteQueryOptions } from "react-query"
import { BlitzqlInputSchema, BlitzqlOutputSchema } from "../types/blitzqlGeneratedTypes"
import { useInternalBlitzql } from "../BlitzqlContext"
import { PickSingleKeyValue } from "app/core/utils/common"

export function useQuery<T extends Partial<BlitzqlInputSchema>, O = BlitzqlOutputSchema<T>>(
  query: T,
  options?: UseQueryOptions<O, unknown>
) {
  const blitzqlStore = useInternalBlitzql()

  const [data, queryOptions] = useBlitzQuery(
    blitzqlStore.resolvers.query,
    {
      // @ts-ignore
      query,
    },
    // @ts-ignore
    options
  )

  return [data as O, queryOptions] as const
}

export function useInfiniteQuery<
  K extends keyof BlitzqlInputSchema,
  Q extends PickSingleKeyValue<BlitzqlInputSchema, K>,
  O = PickSingleKeyValue<BlitzqlOutputSchema<{ [key in K]: Q }>, K>
>(nodeKey: K, query: Q, options: UseInfiniteQueryOptions<O, any>) {
  const blitzqlStore = useInternalBlitzql()

  const [data, queryOptions] = useBlitzInfiniteQuery(
    blitzqlStore.resolvers.query,
    () => ({ query: { [nodeKey]: query } }),
    // @ts-ignore
    {
      ...options,
      getNextPageParam: (prevPage) => {
        // @ts-ignore
        const prev = prevPage[nodeKey]

        // @ts-ignore
        return options?.getNextPageParam ? options.getNextPageParam(prev) : prev.nextPage
      },
    }
  )

  // @ts-ignore
  return [data.map((props) => props[nodeKey]) as Array<O>, queryOptions] as const
}

export function usePaginatedQuery() {}
