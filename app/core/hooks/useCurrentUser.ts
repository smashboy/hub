import { useQuery } from "blitz"
import { UseQueryOptions } from "react-query"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = (suspense?: boolean) => {
  const [user] = useQuery(getCurrentUser, null, {
    suspense: suspense ?? true,
  })
  return user
}
