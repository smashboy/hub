import { resolver, SecurePassword } from "blitz"
import db, { UserRole } from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(resolver.zod(Signup), async ({ email, username, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      username: username.trim(),
      role: UserRole.USER,
    },
    select: { id: true, role: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role })
  return user
})
