import { resolver } from "blitz"
import db from "db"
import { Signup } from "../validations"

export default resolver.pipe(
  resolver.zod(Signup.omit({ email: true, password: true })),
  async ({ username }) => {
    const existedUsername = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    return Boolean(existedUsername)
  }
)
