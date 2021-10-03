import { resolver } from "blitz"
import db from "db"
import { Signup } from "../validations"

export default resolver.pipe(
  resolver.zod(Signup.omit({ username: true, password: true })),
  async ({ email }) => {
    const existedUserEmail = await db.user.findFirst({
      where: {
        email,
      },
    })

    return Boolean(existedUserEmail)
  }
)
