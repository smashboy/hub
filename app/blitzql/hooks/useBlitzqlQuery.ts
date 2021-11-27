import {
  useQuery as useBlitzQuery,
  useInfiniteQuery as useBlitzInfiniteQuery,
  usePaginatedQuery as useBlitzPaginatedQuery,
} from "blitz"
import { UseQueryOptions } from "react-query"
import { BlitzqlInputSchema, BlitzqlOutputSchema } from "../types/blitzqlGeneratedTypes"
import { useInternalBlitzql } from "../BlitzqlContext"

export function useQuery<T extends Partial<BlitzqlInputSchema>>(options?: UseQueryOptions) {
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

  return [data as BlitzqlOutputSchema<T>, queryOptions] as const
}

export function useInfiniteQuery() {}

export function usePaginatedQuery() {}
