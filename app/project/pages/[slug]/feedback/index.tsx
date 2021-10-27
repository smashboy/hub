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

export type FeedbackFilter = Partial<{
  [key in FeedbackFilterKey]: Prisma.ProjectFeedbackWhereInput
}>

const _createFilter = (
  key: FeedbackFilterKey,
  ids: Array<string | number>
): Prisma.ProjectFeedbackWhereInput => {
  if (key === "labels")
    return {
      labels: {
        some: {
          id: {
            in: ids as string[],
          },
        },
      },
    }

  if (key === "members")
    return {
      participants: {
        some: {
          id: {
            in: ids as number[],
          },
        },
      },
    }

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

const FeedbackPage: BlitzPage<ProjectPageProps> = ({
  project: { slug, role },
}: ProjectPageProps) => {
  const [filter, setFilter] = useState<FeedbackFilter>({})
  const [debouncedFilter] = useDebounce(filter, 1000)

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

  return (
    <Grid container spacing={1} sx={{ marginTop: 1 }}>
      <FeedbackListHeader
        projectSlug={slug}
        role={role}
        onOptionsFilter={handleFilter}
        onSearchQueryFilter={handleSearchQuery}
      />
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <FeedbackList slug={slug} role={role} filter={debouncedFilter} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

FeedbackPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="feedback" {...props}>
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
