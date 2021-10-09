import { useCallback } from "react"
import { dynamic } from "blitz"
import { Grid, Box, useTheme, Hidden, Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { alpha } from "@mui/material/styles"
import type { Editable as EditableType } from "slate-react"
import Element from "./Element"
import Leaf from "./Leaf"
import { useEditor } from "../EditorContext"

const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), {
  ssr: false,
}) as unknown as typeof EditableType

const Editor = () => {
  const theme = useTheme()

  const {
    setIsFocused,
    submitText,
    disableSubmit,
    onSubmit,
    content,
    readOnly,
    onCancel,
    editVariant,
  } = useEditor()

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const handleSubmit = () => onSubmit?.(content)

  const height = readOnly ? "auto" : 350

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Box
          sx={{
            height,
            maxHeight: height,
            borderRadius: 1,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.action.selected,
            bgcolor: alpha(theme.palette.background.paper, 0.15),
            padding: 1,
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
        </Box>
      </Grid>
      {!readOnly && (
        <Hidden smDown>
          {editVariant ? (
            <Grid container item xs={12} spacing={1} justifyContent="flex-end">
              <Grid item xs={2}>
                <Button onClick={() => onCancel?.()} variant="contained" color="inherit" fullWidth>
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
