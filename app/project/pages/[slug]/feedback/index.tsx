import { Prisma } from "db"
import { Suspense, useState } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { useDebounce } from "use-debounce"
import { Grid } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import FeedbackListHeader from "app/project/components/FeedbackListHeader"
import FeedbackList from "app/project/components/FeedbackList"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"

export type FeedbackFilterKey = "labels" | "members" | "roadmaps" | "searchQuery"
export type FeedbackSortKey = "newest" | "oldest" | "upvoted-more" | "upvoted-less"

export type FeedbackFilter = Partial<{
  [key in FeedbackFilterKey]: Prisma.ProjectFeedbackWhereInput
}>

const _createFilter = (
  key: FeedbackFilterKey,
  ids: Array<string | number>
): Prisma.ProjectFeedbackWhereInput => {
  switch (key) {
    case "labels":
      return {
        labels: {
          some: {
            id: {
              in: ids as string[],
            },
          },
        },
      }
    case "members":
      return {
        participants: {
          some: {
            id: {
              in: ids as number[],
            },
          },
        },
      }
    default:
      return {
        roadmaps: {
          some: {
            id: {
              in: ids as number[],
            },
          },
        },
      }
  }
}

const FeedbackPage: BlitzPage<ProjectPageProps> = ({
  project: { slug, role },
}: ProjectPageProps) => {
  const [filter, setFilter] = useState<FeedbackFilter>({})
  const [sortBy, setSortBy] = useState<FeedbackSortKey>("newest")
  const [debouncedFilter] = useDebounce(filter, 500)

  const handleFilter = (key: FeedbackFilterKey) => (ids: Array<string | number>) => {
    const newFilter = { ...filter }

    if (ids.length === 0) {
      if (newFilter[key]) {
        delete newFilter[key]
        setFilter(newFilter)
      }
      return
    }

    newFilter[key] = _createFilter(key, ids)

    setFilter(newFilter)
  }

  const handleSearchQuery = (newQuery: string) => {
    const newFilter = { ...filter }

    if (newQuery) {
      newFilter["searchQuery"] = {
        content: {
          title: {
            contains: newQuery,
            mode: "insensitive",
          },
        },
      }

      return setFilter(newFilter)
    }

    if (newFilter["searchQuery"]) {
      delete newFilter["searchQuery"]
      setFilter(newFilter)
    }
  }

  const handleSort = (key: FeedbackSortKey) => setSortBy(key)

  return (
    <Grid container spacing={1} sx={{ marginTop: 1 }}>
      <FeedbackListHeader
        onSort={handleSort}
        onOptionsFilter={handleFilter}
        onSearchQueryFilter={handleSearchQuery}
      />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <FeedbackList filter={debouncedFilter} sortBy={sortBy} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

FeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={`Feedback | ${props.project.name}`} selectedTab="feedback" {...props}>
    {page}
  </ProjectLayout>
)

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const props = await getProjectInfo(slug, session)

  if (!props)
    return {
      notFound: true,
    }

  return {
    props,
  }
}

export default FeedbackPage
