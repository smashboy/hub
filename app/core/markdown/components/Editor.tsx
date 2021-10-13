import { useCallback } from "react"
import { dynamic } from "blitz"
import { Grid, Hidden, Button, Paper } from "@mui/material"
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
    content,
    disablePadding,
    readOnly,
    onCancel,
    height,
    editVariant,
    resetContent,
  } = useEditor()

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const handleSubmit = () => onSubmit?.(content)

  const handleCancel = () => {
    resetContent()
    onCancel?.()
  }

  const maxHeight = readOnly ? "auto" : height

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            height: maxHeight,
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
            style={{ height: "100%", maxHeight: 350, overflowY: "auto" }}
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
        <Hidden smDown>
          {editVariant ? (
            <Grid container item xs={12} spacing={1} justifyContent="flex-end">
              <Grid item xs={2}>
                <Button onClick={handleCancel} variant="contained" color="inherit" fullWidth>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={2}>
                <LoadingButton
                  onClick={handleSubmit}
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
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                disabled={disableSubmit}
              >
                {submitText}
              </LoadingButton>
            </Grid>
          )}
        </Hidden>
      )}
    </Grid>
  )
}

export default Editor
