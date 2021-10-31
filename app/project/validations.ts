import { FeedbackCategory, FeedbackMessageCategory, FeedbackStatus, ProjectMemberRole } from "db"
import * as z from "zod"

export const projectName = z
  .string()
  .regex(new RegExp("^[A-Za-z0-9_-\\s]{3,50}$"), { message: "Invalid project name" })

export const CreateProject = z.object({
  name: projectName,
  description: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  color: z.string(),
  isPrivate: z.boolean(),
})

export const GetCreateFeedbackInfo = z.object({
  slug: z.string(),
})

export const CreateLabel = z.object({
  name: z.string().min(1).max(50),
  color: z.string(),
  projectSlug: z.string(),
  description: z.string().max(100).optional(),
})

export const FollowProject = z.object({
  slug: z.string(),
})

export const UpdateProject = CreateProject.omit({ isPrivate: true }).merge(
  z.object({
    slug: z.string(),
  })
)

export const UpdateIsProjectPrivateDanger = z.object({
  slug: z.string(),
  isPrivate: z.boolean(),
})

export const CreateFeedback = z.object({
  projectSlug: z.string(),
  title: z.string().min(1).max(75),
  category: z.enum([FeedbackCategory.BUG, FeedbackCategory.FEATURE, FeedbackCategory.IMPROVEMENT]),
  content: z.string(),
  participants: z.array(z.number()),
  roadmaps: z.array(z.number()),
  labels: z.array(z.string()),
})

export const UpdateFeedback = z.object({
  feedbackId: z.number(),
  title: z.string().min(1).max(75),
  category: z.enum([FeedbackCategory.BUG, FeedbackCategory.FEATURE, FeedbackCategory.IMPROVEMENT]),
  content: z.string(),
})

export const UpdateFeedbackParticipants = z.object({
  feedbackId: z.number(),
  participants: z.array(z.number()),
  projectSlug: z.string(),
})

export const UpdateFeedbackLabels = z.object({
  feedbackId: z.number(),
  labels: z.array(z.string()),
  projectSlug: z.string(),
})

export const UpdateFeedbackRoadmaps = z.object({
  feedbackId: z.number(),
  roadmaps: z.array(z.number()),
  projectSlug: z.string(),
})

export const UpdateFeedbackStatus = z.object({
  feedbackId: z.number(),
  projectSlug: z.string(),
  status: z.enum([
    FeedbackStatus.BLOCKED,
    FeedbackStatus.CANCELED,
    FeedbackStatus.COMPLETED,
    FeedbackStatus.DUPLICATE,
    FeedbackStatus.IN_PROGRESS,
    FeedbackStatus.ON_REVIEW,
    FeedbackStatus.PENDING,
    FeedbackStatus.PLANNED,
  ]),
})

const feedbackMessageCategory = z.enum([
  FeedbackMessageCategory.INTERNAL,
  FeedbackMessageCategory.PUBLIC,
  FeedbackMessageCategory.PRIVATE,
])

export const CreateFeedbackMessage = z.object({
  feedbackId: z.number(),
  content: z.string(),
  category: feedbackMessageCategory,
})

export const UpdateFeedbackMessage = z.object({
  messageId: z.number(),
  content: z.string(),
})

export const DeleteFeedbcakMessage = UpdateFeedbackMessage.omit({ content: true })

export const GetFeedbackMessages = z.object({
  feedbackId: z.number(),
  category: feedbackMessageCategory,
})

export const UpvoteFeedback = z.object({
  feedbackId: z.number(),
})

export const DeleteProjectMember = z.object({
  memberId: z.number(),
  projectSlug: z.string(),
})

export const UpdateProjectMember = DeleteProjectMember.merge(
  z.object({
    role: z.enum([ProjectMemberRole.ADMIN, ProjectMemberRole.MODERATOR, ProjectMemberRole.MEMBER]),
  })
)

export const SearchUsers = z.object({
  projectSlug: z.string(),
  query: z.string(),
})

export const CreateProjectInvites = z.object({
  projectSlug: z.string(),
  usersId: z.array(z.number()),
})

export const DeleteProjectInvite = z.object({
  inviteId: z.number(),
  projectSlug: z.string(),
})

export const ManageProjectInvite = z.object({
  inviteId: z.number(),
})

export const CreateRoadmap = z.object({
  name: z.string().min(1).max(75),
  description: z.string().max(100).nullable(),
  dueTo: z.date().nullable(),
  projectSlug: z.string(),
})

export const UpdateProjectRoadmap = CreateRoadmap.omit({ projectSlug: true }).merge(
  z.object({
    roadmapId: z.number(),
  })
)

export const GetFeedbackContent = z.object({
  projectSlug: z.string(),
  feedbackId: z.number(),
})

export const FilterRoadmapFeedback = z.object({
  roadmapId: z.number(),
  category: z
    .enum([FeedbackCategory.BUG, FeedbackCategory.FEATURE, FeedbackCategory.IMPROVEMENT])
    .nullable(),
})

export const CreateChangelog = z.object({
  projectSlug: z.string(),
  title: z.string(),
  content: z.string(),
})

export const UpdateChangelog = CreateChangelog.merge(
  z.object({
    changelogId: z.number(),
  })
)

export const CreateChangelogFeedback = z.object({
  changelogId: z.number(),
  rating: z.number(),
  description: z.string().nullable(),
})

export const GetChangelogFeedback = z.object({
  changelogId: z.number(),
  projectSlug: z.string(),
})

export const GetFeedbackSearchOptions = z.object({
  projectSlug: z.string(),
})
