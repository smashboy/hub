import { useState } from "react"
import { Grid, Hidden, BottomNavigation, Paper, Slide, useTheme, Container } from "@mui/material"
import BoldIcon from "@mui/icons-material/FormatBold"
import ItalicIcon from "@mui/icons-material/FormatItalic"
import UnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import StrikeIcon from "@mui/icons-material/StrikethroughS"
import CodeIcon from "@mui/icons-material/Code"
import BulListIcon from "@mui/icons-material/FormatListBulleted"
import NumListIcon from "@mui/icons-material/FormatListNumbered"
import BlockIcon from "@mui/icons-material/FormatQuote"
import { MarkButtonProps, BlockButtonProps } from "../types"
import { BlockButton, MarkButton } from "./buttons"
import HeadingSelector from "./HeadingSelector"
import { useEditor } from "../EditorContext"
import LinkSelector from "./LinkSelector"
import ReactVisibilitySensor from "react-visibility-sensor"
import ImageUploader from "./ImageUploader"

// export type EditorMode = "editor" | "preview"

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
    format: "bul-list",
    icon: BulListIcon,
  },
  {
    format: "num-list",
    icon: NumListIcon,
  },
]

const optionsCount = [...markButtons, ...blockButtons].length + 5

const Toolbar = () => {
  const theme = useTheme()

  const { isFocused, readOnly, cleanVariant } = useEditor()

  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  if (readOnly) return null

  return (
    <>
      <Hidden smDown>
        <Grid container item xs={12}>
          {/* <Grid item xs={12} md={3}>
          <Tabs value={mode} onChange={handleModeChange} centered={isSM}>
            <Tab value="editor" label="Editor" />
            <Tab value="preview" label="Preview" />
          </Tabs>
        </Grid> */}
          <Grid container item xs={12} alignItems="center">
            <ReactVisibilitySensor
              onChange={(isVisible) => setIsToolbarVisible(isVisible)}
              active={cleanVariant}
            >
              <Paper variant="outlined" sx={{ width: "100%" }}>
                <HeadingSelector />
                {markButtons.map(({ icon, format }) => (
                  <MarkButton key={format} icon={icon} format={format} />
                ))}
                <LinkSelector />
                <ImageUploader />
                {blockButtons.map(({ icon, format }) => (
                  <BlockButton key={format} icon={icon} format={format} />
                ))}
              </Paper>
            </ReactVisibilitySensor>
            <Slide in={!isToolbarVisible} direction="up" timeout={350}>
              <Container
                maxWidth="md"
                disableGutters
                sx={{
                  position: "fixed",
                  bottom: 10,
                  // right: 10,
                  // left: "50%",
                  // transform: "translateX(-50%)",
                  zIndex: theme.zIndex.modal,
                }}
              >
                <Paper variant="outlined">
                  <HeadingSelector />
                  {markButtons.map(({ icon, format }) => (
                    <MarkButton key={format} icon={icon} format={format} />
                  ))}
                  <LinkSelector />
                  <ImageUploader />
                  {blockButtons.map(({ icon, format }) => (
                    <BlockButton key={format} icon={icon} format={format} />
                  ))}
                </Paper>
              </Container>
            </Slide>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Slide in={isFocused} direction="up" timeout={350}>
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              overflowX: "auto",
              zIndex: theme.zIndex.modal,
            }}
            elevation={3}
          >
            <BottomNavigation
              sx={{ bgcolor: "transparent", width: `calc(80px * ${optionsCount})` }}
            >
              <HeadingSelector isMobile />
              {markButtons.map(({ icon, format }) => (
                <MarkButton key={format} icon={icon} format={format} isMobile />
              ))}
              <LinkSelector isMobile />
              <ImageUploader />
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
