import { useCallback } from "react"
import { dynamic } from "blitz"
import { Grid, Button, Paper, Fab, Box, useTheme, Slide } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import CancelIcon from "@mui/icons-material/Close"
import { LoadingButton } from "@mui/lab"
import type { Editable as EditableType } from "slate-react"
import Element from "./Element"
import Leaf from "./Leaf"
import { useEditor } from "../EditorContext"
import useIsSmallDevice from "app/core/hooks/useIsSmallDevice"

const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), {
  ssr: false,
}) as unknown as typeof EditableType

const Editor = () => {
  const isSM = useIsSmallDevice()

  const theme = useTheme()

  const {
    setIsFocused,
    submitText,
    disableSubmit,
    onSubmit,
    disablePadding,
    readOnly,
    onCancel,
    height,
    cleanVariant,
    editVariant,
  } = useEditor()

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const maxHeight = cleanVariant ? undefined : readOnly ? "none" : height
  const paperHeight = readOnly ? "auto" : height

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        {cleanVariant ? (
          <Editable
            style={{ height: "100%", maxHeight, overflowY: "auto" }}
            renderElement={renderElement}
            readOnly={readOnly}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Leave a comment..."
            renderLeaf={renderLeaf}
          />
        ) : (
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
        )}
      </Grid>
      <Slide in={!readOnly && cleanVariant} direction="left">
        <Box
          sx={{
            position: "fixed",
            bottom: isSM ? undefined : 10,
            top: isSM ? 60 : undefined,
            right: 10,
            zIndex: theme.zIndex.modal,
          }}
        >
          {editVariant ? (
            <>
              <Fab onClick={onCancel} size="small" color="secondary">
                <CancelIcon />
              </Fab>
              <Fab onClick={onSubmit} size="small" color="primary" sx={{ marginLeft: 1 }}>
                <SendIcon />
              </Fab>
            </>
          ) : (
            <Fab onClick={onSubmit} size="small" color="primary">
              <SendIcon />
            </Fab>
          )}
        </Box>
      </Slide>
      {!readOnly && !cleanVariant && (
        <>
          {editVariant ? (
            <Grid container item xs={12} spacing={1} justifyContent="flex-end">
              <Grid item xs={4} md={2}>
                <Button onClick={onCancel} variant="contained" color="secondary" fullWidth>
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
