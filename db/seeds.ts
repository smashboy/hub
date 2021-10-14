import { SecurePassword } from "blitz"
import faker from "faker"
import slugify from "slugify"
import db, { UserRole, User, ProjectMemberRole, Project } from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */

const mainUsers = {
  founder: {
    email: "founder@gmail.com",
    password: "founder",
    username: "Smashboy",
    role: UserRole.USER,
  },
  customer: {
    email: "customer@gmail.com",
    password: "customer",
    username: "Customer",
    role: UserRole.USER,
  },
  admin: {
    email: "admin@gmail.com",
    password: "admin",
    username: "Admin",
    role: UserRole.USER,
  },
  moderator: {
    email: "moderator@gmail.com",
    password: "moderator",
    username: "Moderator",
    role: UserRole.USER,
  },
}

const createMainUsers = async () => {
  const promises: Array<Promise<User>> = Object.values(mainUsers).map(
    async ({ email, password, username, role }) => {
      const hashedPassword = await SecurePassword.hash(password)
      const user = await db.user.create({
        data: {
          email,
          hashedPassword,
          username,
          role,
        },
      })

      return user
    }
  )

  const users = await Promise.all(promises)
  return users
}

const createMainProject = async (founder: User) => {
  const name = "Stream Roulette"

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  })

  const project = await db.project.create({
    data: {
      name,
      description: "Make your live streams more interactive",
      websiteUrl: "https://stream-roulette.up.railway.app",
      color: "#635bff",
      isPrivate: false,
      slug,
      settings: {
        create: {},
      },
      members: {
        create: {
          role: ProjectMemberRole.FOUNDER,
          user: {
            connect: {
              id: founder.id,
            },
          },
        },
      },
    },
  })

  return project
}

const createDumpUsers = async (hashedPassword: string, amount: number) => {
  const queries = new Array(amount).fill(null).map(() =>
    db.user.create({
      data: {
        email: faker.internet.email(),
        hashedPassword,
        username: faker.internet.userName(),
        avatarUrl: faker.internet.avatar(),
        role: UserRole.USER,
      },
    })
  )

  const users = await db.$transaction(queries)

  return users
}

const createProjectDumpMembers = async (
  project: Project,
  role: ProjectMemberRole,
  amount: number
) => {
  const hashedPassword = await SecurePassword.hash(`${project.slug}-${role.toLowerCase()}`)

  const users = await createDumpUsers(hashedPassword, amount)

  const queries = users.map((user) =>
    db.projectMember.create({
      data: {
        role,
        user: {
          connect: {
            id: user.id,
          },
        },
        project: {
          connect: {
            id: project.id,
          },
        },
      },
    })
  )

  await db.$transaction(queries)
}

const seed = async () => {
  await db.$reset()

  const users = await createMainUsers()
  const founder = users[0]!

  const mainProject = await createMainProject(founder)

  await createProjectDumpMembers(mainProject, ProjectMemberRole.MEMBER, 45)
  await createProjectDumpMembers(mainProject, ProjectMemberRole.MODERATOR, 15)
  await createProjectDumpMembers(mainProject, ProjectMemberRole.ADMIN, 5)
}

export default seed
