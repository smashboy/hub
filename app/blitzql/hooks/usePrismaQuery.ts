import { useQuery } from "blitz"
import { UseQueryOptions } from "react-query"
import { PrismaQuery } from "../EndpointQueryPipeBuilder"
import blitzqlQueries from "../queries/blitzqlQueries"

export function usePrismaQuery(query: Partial<PrismaQuery>, options?: UseQueryOptions) {
  const data = useQuery(
    blitzqlQueries,
    {
      // @ts-ignore
      query,
    },
    // @ts-ignore
    options
  )

  return data
}
