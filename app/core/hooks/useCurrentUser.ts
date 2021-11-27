import { useQuery } from "app/blitzql/hooks/useBlitzqlQuery"

export const useCurrentUser = (suspense?: boolean) => {
  const [data] = useQuery(
    {
      authUser: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
    {
      suspense: suspense ?? true,
    }
  )

  return data?.authUser
}
