import { Suspense } from "react"
import { useQuery } from "blitz"
import { Container, Grid, Hidden } from "@mui/material"
import getAbility from "app/guard/queries/getAbility"
import {
  FeedbackEditorProps,
  FeedbackEditorProvider,
} from "app/project/store/FeedbackEditorContext"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import Header from "./Header"
import Editor from "./Editor"
import FeedbackOptions from "./FeedbackOptions"

const FeedbackEditor: React.FC<FeedbackEditorProps> = ({ slug, initialValues }) => {
  const isSM = useIsSmallDevice()

  const [res] = useQuery(getAbility, [["update", "feedback.settings", slug]], {
    suspense: false,
    refetchOnWindowFocus: false,
  })

  const canManageSettings = res?.[0]?.can || false

  const showSettings = canManageSettings

  return (
    <FeedbackEditorProvider slug={slug} initialValues={initialValues}>
      <Container maxWidth="lg" disableGutters sx={{ marginTop: 3 }}>
        <Grid container spacing={2} sx={{ height: "fit-content" }}>
          <Grid
            container
            item
            rowSpacing={2}
            xs={showSettings && !isSM ? 9 : 12}
            sx={{ height: "fit-content" }}
          >
            <Header />
            <Editor />
          </Grid>
          {showSettings && (
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
