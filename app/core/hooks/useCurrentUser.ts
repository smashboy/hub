import { useQuery } from "blitz"
import { UseQueryOptions } from "react-query"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = (props?: { options?: UseQueryOptions }) => {
  // @ts-ignore
  const [user] = useQuery(getCurrentUser, null, props?.options)
  return user
}
