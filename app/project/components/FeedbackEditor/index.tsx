import { ProjectMemberRole } from "db"
import { Suspense } from "react"
import { useQuery } from "blitz"
import { Container, Grid } from "@mui/material"
import getAbility from "app/guard/queries/getAbility"
import {
  FeedbackEditorProps,
  FeedbackEditorProvider,
} from "app/project/store/FeedbackEditorContext"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import Header from "./Header"
import Editor from "./Editor"
import FeedbackOptions from "./FeedbackOptions"
import { useProject } from "app/project/store/ProjectContext"

const FeedbackEditor: React.FC<FeedbackEditorProps> = ({ initialValues }) => {
  const isSM = useIsSmallDevice()

  const {
    project: { role },
  } = useProject()

  return (
    <FeedbackEditorProvider initialValues={initialValues}>
      <Container maxWidth="lg" disableGutters sx={{ marginTop: 3 }}>
        <Grid container spacing={2} sx={{ height: "fit-content" }}>
          <Grid
            container
            item
            rowSpacing={2}
            xs={role && !isSM ? 9 : 12}
            sx={{ height: "fit-content" }}
          >
            <Header />
            <Editor />
          </Grid>
          {role && (
            <Suspense fallback={<div />}>
              <FeedbackOptions />
            </Suspense>
          )}
        </Grid>
      </Container>
    </FeedbackEditorProvider>
  )
}

export default FeedbackEditor
