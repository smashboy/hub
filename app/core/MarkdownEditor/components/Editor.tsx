import { useCallback } from "react"
import { dynamic } from "blitz"
import { Grid, Box, useTheme } from "@mui/material"
import { alpha } from "@mui/material/styles"
import type { Editable as EditableType } from "slate-react"
import Element from "./Element"
import Leaf from "./Leaf"

const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), {
  ssr: false,
}) as unknown as typeof EditableType

const Editor = () => {
  const theme = useTheme()

  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          height: 350,
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.palette.action.selected,
          bgcolor: alpha(theme.palette.background.paper, 0.15),
          padding: 1,
        }}
      >
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
      </Box>
    </Grid>
  )
}

export default Editor
