import { Suspense } from "react"
import { useQuery } from "blitz"
import { Container, Grid, TextField, MenuItem, Hidden, Fade } from "@mui/material"
import getAbility from "app/guard/queries/getAbility"
import { FeedbackEditorProvider } from "app/project/store/FeedbackEditorContext"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import Header from "./Header"
import Editor from "./Editor"
import Sidebar from "./Sidebar"

const FeedbackEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const isSM = useIsSmallDevice()

  const [res] = useQuery(getAbility, [["manage", "feedback.settings", slug]], {
    suspense: false,
    refetchOnWindowFocus: false,
  })

  const canManageSettings = res?.[0]?.can || false

  return (
    <FeedbackEditorProvider slug={slug}>
      <Container maxWidth="lg" disableGutters sx={{ marginTop: 3 }}>
        <Grid container spacing={2}>
          <Grid container spacing={2} item xs={canManageSettings && !isSM ? 9 : 12}>
            <Header />
            <Editor />
          </Grid>
          {canManageSettings && (
            <Hidden smDown>
              <Suspense fallback={<div />}>
                <Grid item xs={3}>
                  <Sidebar />
                </Grid>
              </Suspense>
            </Hidden>
          )}
        </Grid>
      </Container>
    </FeedbackEditorProvider>
  )
}

export default FeedbackEditor
