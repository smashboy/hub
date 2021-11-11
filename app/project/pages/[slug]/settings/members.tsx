import { ProjectMemberRole } from "db"
import { BlitzPage, getSession, GetServerSideProps } from "blitz"
import { Grid, Fade } from "@mui/material"

import {
  getProjectInfo,
  getProjectMembersSettings,
  MembersSettingsPageProps,
} from "app/project/helpers"
import { authConfig } from "app/core/configs/authConfig"
import ProjectSettingsLayout from "app/project/layouts/ProjectSettingsLayout"
import ManageMembersSettings from "app/project/components/ManageMembersSettings"
import ManageProjectInvites from "app/project/components/ManageProjectInvites"
import { MemberInvitesDialogProvider } from "app/project/store/MemberInvitesDialogContext"

const MembersSettingPage: BlitzPage<MembersSettingsPageProps> = ({
  memberSettings: { members, invites },
}: MembersSettingsPageProps) => {
  return (
    <MemberInvitesDialogProvider>
      <Grid container spacing={2}>
        <Fade in timeout={500}>
          <Grid item xs={12}>
            <ManageMembersSettings members={members} />
          </Grid>
        </Fade>
        <Fade in timeout={750}>
          <Grid item xs={12}>
            <ManageProjectInvites invites={invites} />
          </Grid>
        </Fade>
      </Grid>
    </MemberInvitesDialogProvider>
  )
}

MembersSettingPage.authenticate = authConfig

MembersSettingPage.getLayout = (page, props: MembersSettingsPageProps) => (
  <ProjectSettingsLayout
    title={`${props.project.name} members settings`}
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
