import { Grid, ButtonGroup, Hidden, BottomNavigation, Paper, Slide } from "@mui/material"
import BoldIcon from "@mui/icons-material/FormatBold"
import ItalicIcon from "@mui/icons-material/FormatItalic"
import UnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import StrikeIcon from "@mui/icons-material/StrikethroughS"
import CodeIcon from "@mui/icons-material/Code"
import BulListIcon from "@mui/icons-material/FormatListBulleted"
import NumListIcon from "@mui/icons-material/FormatListNumbered"
import LinkIcon from "@mui/icons-material/Link"
import ImageIcon from "@mui/icons-material/Image"
import BlockIcon from "@mui/icons-material/FormatQuote"
import { MarkButtonProps, BlockButtonProps } from "../types"
import { BlockButton, MarkButton } from "./buttons"
import HeadingSelector from "./HeadingSelector"
import { useEditor } from "../EditorContext"

// export type MarkdownEditorMode = "editor" | "preview"

const markButtons: MarkButtonProps[] = [
  {
    format: "bold",
    icon: BoldIcon,
  },
  {
    format: "italic",
    icon: ItalicIcon,
  },
  {
    format: "underlined",
    icon: UnderlinedIcon,
  },
  {
    format: "code",
    icon: CodeIcon,
  },
  {
    format: "strike",
    icon: StrikeIcon,
  },
]

const blockButtons: BlockButtonProps[] = [
  {
    format: "block",
    icon: BlockIcon,
  },
  {
    format: "link",
    icon: LinkIcon,
  },
  {
    format: "image",
    icon: ImageIcon,
  },
  {
    format: "bul-list",
    icon: BulListIcon,
  },
  {
    format: "num-list",
    icon: NumListIcon,
  },
]

const Toolbar = () => {
  const { isFocused } = useEditor()

  return (
    <>
      <Grid container item xs={12}>
        {/* <Grid item xs={12} md={3}>
          <Tabs value={mode} onChange={handleModeChange} centered={isSM}>
            <Tab value="editor" label="Editor" />
            <Tab value="preview" label="Preview" />
          </Tabs>
        </Grid> */}
        <Hidden smDown>
          <Grid container item xs={12} alignItems="center">
            <Paper sx={{ width: "100%" }}>
              <ButtonGroup>
                <HeadingSelector />
                {markButtons.map(({ icon, format }) => (
                  <MarkButton key={format} icon={icon} format={format} />
                ))}
                {blockButtons.map(({ icon, format }) => (
                  <BlockButton key={format} icon={icon} format={format} />
                ))}
              </ButtonGroup>
            </Paper>
          </Grid>
        </Hidden>
      </Grid>
      <Hidden smUp>
        <Slide in={isFocused} direction="up" timeout={350}>
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              overflowX: "auto",
            }}
            elevation={3}
          >
            <BottomNavigation sx={{ bgcolor: "transparent", width: "calc(80px * 11)" }}>
              <HeadingSelector isMobile />
              {markButtons.map(({ icon, format }) => (
                <MarkButton key={format} icon={icon} format={format} isMobile />
              ))}
              {blockButtons.map(({ icon, format }) => (
                <BlockButton key={format} icon={icon} format={format} isMobile />
              ))}
            </BottomNavigation>
          </Paper>
        </Slide>
      </Hidden>
    </>
  )
}

export default Toolbar
