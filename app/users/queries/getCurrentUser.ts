import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  const authUserId = session.userId

  if (!authUserId) return null

  const user = await db.user.findFirst({
    where: { id: authUserId },
    select: { id: true, username: true, email: true, role: true },
  })

  return user
}
