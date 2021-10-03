import { z } from "zod"

export const password = z.string().min(8).max(100)

export const username = z
  .string()
  .regex(new RegExp("^[a-zA-Z0-9_-]{3,15}$"), { message: "Invalid username" })

export const Signup = z.object({
  email: z.string().email(),
  username,
  password,
})

export const Login = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const ForgotPassword = z.object({
  email: z.string().email(),
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
