import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps } from "blitz"
import { useDebounce } from "use-debounce"
import { Grid, Fade } from "@mui/material"

import {
  getProjectInfo,
  getProjectMembersSettings,
  MembersSettingsPageProps,
} from "app/project/helpers"
import { authConfig } from "app/core/configs/authConfig"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import ManageMembersSettings from "app/project/components/ManageMembersSettings"

const MembersSettingPage: BlitzPage<MembersSettingsPageProps> = ({
  memberSettings: { members },
  project: { slug, name },
}: MembersSettingsPageProps) => {
  return (
    <Grid container spacing={2}>
      <Fade in timeout={500}>
        <Grid item xs={12}>
          <ManageMembersSettings members={members} slug={slug} name={name} />
        </Grid>
      </Fade>
    </Grid>
  )
}

MembersSettingPage.authenticate = authConfig

MembersSettingPage.getLayout = (page, props: MembersSettingsPageProps) => (
  <ProjectSettingsLayout
    title={`${props.project.name} Members settings`}
    {...props}
    selectedTab="members"
  >
    {page}
  </ProjectSettingsLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession(req, res)
  const slug = (params?.slug as string) || null

  const projectProps = await getProjectInfo(slug, session, [
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.FOUNDER,
  ])

  if (!projectProps)
    return {
      notFound: true,
    }

  const settingsProps = await getProjectMembersSettings(slug!)

  return {
    props: { ...projectProps, ...settingsProps },
  }
}

export default MembersSettingPage
