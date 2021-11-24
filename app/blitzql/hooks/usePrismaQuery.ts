import { useQuery } from "blitz"
import { UseQueryOptions } from "react-query"
import { QuerySchema } from "../types"
import blitzqlQuery from "../queries/blitzqlQuery"

export function usePrismaQuery(query: Partial<QuerySchema>, options?: UseQueryOptions) {
  const data = useQuery(
    blitzqlQuery,
    {
      // @ts-ignore
      query,
    },
    // @ts-ignore
    options
  )

  return data
}
