import { usePrismaQuery } from "app/blitzql/hooks/usePrismaQuery"

export const useCurrentUser = (suspense?: boolean) => {
  const [data] = usePrismaQuery(
    {
      authUser: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
    {
      suspense: suspense ?? true,
    }
  )

  console.log(data)

  return data.authUser
}
