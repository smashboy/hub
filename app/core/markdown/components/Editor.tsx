import { useCallback } from "react"
import { dynamic } from "blitz"
import { Grid, Button, Paper } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import type { Editable as EditableType } from "slate-react"
import Element from "./Element"
import Leaf from "./Leaf"
import { useEditor } from "../EditorContext"

const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), {
  ssr: false,
}) as unknown as typeof EditableType

const Editor = () => {
  const {
    setIsFocused,
    submitText,
    disableSubmit,
    onSubmit,
    disablePadding,
    readOnly,
    onCancel,
    height,
    editVariant,
  } = useEditor()

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const maxHeight = readOnly ? "none" : height
  const paperHeight = readOnly ? "auto" : height

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            height: paperHeight,
            maxHeight,
            bgcolor: readOnly ? "transparent" : undefined,
            borderWidth: readOnly ? 0 : undefined,
            // borderStyle: "solid",
            // borderColor: theme.palette.action.selected,
            // bgcolor: alpha(theme.palette.background.paper, 0.15),
            padding: disablePadding && readOnly ? 0 : 1,
          }}
        >
          <Editable
            style={{ height: "100%", maxHeight, overflowY: "auto" }}
            renderElement={renderElement}
            readOnly={readOnly}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Leave a comment..."
            renderLeaf={renderLeaf}
          />
        </Paper>
      </Grid>
      {!readOnly && (
        <>
          {editVariant ? (
            <Grid container item xs={12} spacing={1} justifyContent="flex-end">
              <Grid item xs={4} md={2}>
                <Button onClick={onCancel} variant="contained" color="inherit" fullWidth>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={4} md={2}>
                <LoadingButton
                  onClick={onSubmit}
                  variant="contained"
                  fullWidth
                  disabled={disableSubmit}
                >
                  Update
                </LoadingButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              {/* TODO: loading state */}
              <LoadingButton
                onClick={onSubmit}
                variant="contained"
                fullWidth
                disabled={disableSubmit}
              >
                {submitText}
              </LoadingButton>
            </Grid>
          )}
        </>
      )}
    </Grid>
  )
}

export default Editor
