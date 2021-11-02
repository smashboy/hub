import { useQuery } from "blitz"
import getAuthUserNotificationsCount from "../queries/getAuthUserNotificationsCount"

const useNotificationsCounter = (suspense?: boolean) => {
  const res = useQuery(getAuthUserNotificationsCount, null, {
    suspense: suspense ?? true,
  })

  return res
}

export default useNotificationsCounter
