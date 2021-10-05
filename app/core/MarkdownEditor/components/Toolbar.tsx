import { useState } from "react"
import {
  Grid,
  Tab,
  Tabs,
  ButtonGroup,
  Hidden,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import BoldIcon from "@mui/icons-material/FormatBold"
import ItalicIcon from "@mui/icons-material/FormatItalic"
import UnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import StrikeIcon from "@mui/icons-material/StrikethroughS"
import CodeIcon from "@mui/icons-material/Code"
import BulListIcon from "@mui/icons-material/FormatListBulleted"
import NumListIcon from "@mui/icons-material/FormatListNumbered"
import LinkIcon from "@mui/icons-material/Link"
import ImageIcon from "@mui/icons-material/Image"
import { MarkButtonProps, BlockButtonProps } from "../types"
import { BlockButton, MarkButton } from "./buttons"

export type MarkdownEditorMode = "editor" | "preview"

const markButtons: MarkButtonProps[] = [
  {
    format: "bold",
    icon: <BoldIcon />,
  },
  {
    format: "italic",
    icon: <ItalicIcon />,
  },
  {
    format: "underlined",
    icon: <UnderlinedIcon />,
  },
  {
    format: "code",
    icon: <CodeIcon />,
  },
  {
    format: "strike",
    icon: <StrikeIcon />,
  },
]

const blockButtons: BlockButtonProps[] = [
  {
    format: "link",
    icon: <LinkIcon />,
  },
  {
    format: "image",
    icon: <ImageIcon />,
  },
  {
    format: "bul-list",
    icon: <BulListIcon />,
  },
  {
    format: "num-list",
    icon: <NumListIcon />,
  },
]

const Toolbar = () => {
  const isSM = useIsSmallDevice()

  const [mode, setMode] = useState<MarkdownEditorMode>("editor")

  const handleModeChange = (event: React.SyntheticEvent, newValue: MarkdownEditorMode) =>
    setMode(newValue)

  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={12} md={3}>
          <Tabs value={mode} onChange={handleModeChange} centered={isSM}>
            <Tab value="editor" label="Editor" />
            <Tab value="preview" label="Preview" />
          </Tabs>
        </Grid>
        <Hidden smDown>
          <Grid container item xs={12} md={9} alignItems="center" justifyContent="flex-end">
            <ButtonGroup>
              {markButtons.map(({ icon, format }) => (
                <MarkButton key={format} icon={icon} format={format} />
              ))}
              {blockButtons.map(({ icon, format }) => (
                <BlockButton key={format} icon={icon} format={format} />
              ))}
            </ButtonGroup>
          </Grid>
        </Hidden>
      </Grid>
      <Hidden smUp>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, overflowX: "auto" }}
          elevation={3}
        >
          <BottomNavigation sx={{ bgcolor: "transparent" }}>
            {markButtons.map(({ icon, format }) => (
              <BottomNavigationAction key={format} icon={icon} />
            ))}
            {blockButtons.map(({ icon, format }) => (
              <BottomNavigationAction key={format} icon={icon} />
            ))}
          </BottomNavigation>
        </Paper>
      </Hidden>
    </>
  )
}

export default Toolbar
