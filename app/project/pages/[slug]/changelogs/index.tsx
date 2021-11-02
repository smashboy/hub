import { Suspense } from "react"
import { BlitzPage, GetServerSideProps, getSession } from "blitz"
import { Grid } from "@mui/material"
import { getProjectInfo, ProjectPageProps } from "app/project/helpers"
import ProjectLayout from "app/project/layouts/ProjectLayout"
import ChangelogList from "app/project/components/ChangelogList"

const ChangelogListPage: BlitzPage<ProjectPageProps> = ({
  project: { slug },
}: ProjectPageProps) => {
  return (
    <Grid container spacing={1} sx={{ marginTop: 1 }}>
      <Grid item xs={12}>
        <Suspense fallback={null}>
          <ChangelogList slug={slug} />
        </Suspense>
      </Grid>
    </Grid>
  )
}

ChangelogListPage.getLayout = (page, props: ProjectPageProps) => (
  <ProjectLayout title={props.project.name} selectedTab="changelogs" {...props}>
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

export default ChangelogListPage
