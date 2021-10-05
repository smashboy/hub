import { useState } from "react"
import {
  Button,
  Menu,
  MenuItem,
  Hidden,
  BottomNavigationAction,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  FormControlLabel,
  Radio,
  Grid,
  Typography,
} from "@mui/material"
import HeadingSize from "@mui/icons-material/FormatSize"
import Dialog from "app/core/components/Dialog"
import { HeadingLevel } from "../types"

type HeadingOptionsItemProps = { label: string; value: HeadingLevel | null }

const options: Array<HeadingOptionsItemProps> = [
  {
    label: "Heading 1",
    value: 1,
  },
  {
    label: "Heading 2",
    value: 2,
  },
  {
    label: "Heading 3",
    value: 3,
  },
  {
    label: "Heading 4",
    value: 4,
  },
  {
    label: "Heading 5",
    value: 5,
  },
  {
    label: "Heading 6",
    value: 6,
  },
  {
    label: "None",
    value: null,
  },
]

const HeadingOptionItem: React.FC<HeadingOptionsItemProps> = ({ label, value }) => (
  <Grid item xs={12}>
    <Paper variant="outlined" sx={{ padding: 2, bgcolor: "transparent" }}>
      <FormControlLabel
        value={value}
        control={<Radio />}
        label={
          label
          // value ? (
          //   <Typography variant={`h${value}`} noWrap component="div">
          //     {label}
          //   </Typography>
          // ) : (
          //   label
          // )
        }
        // disableTypography={Boolean(value)}
      />
    </Paper>
  </Grid>
)

const HeadingSelector: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  if (isMobile)
    return (
      <>
        <BottomNavigationAction onMouseDown={handleOpen} icon={<HeadingSize color="action" />} />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select heading</DialogTitle>
          <DialogContent>
            <RadioGroup>
              <Grid container spacing={1}>
                {options.map((option) => (
                  <HeadingOptionItem key={option.label} {...option} />
                ))}
              </Grid>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    )

  return (
    <>
      <Button onClick={handleOpen}>
        <HeadingSize color="action" />
      </Button>
      <Hidden smDown>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {options.map(({ label }) => (
            <MenuItem key={label} onClick={handleClose}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Hidden>
    </>
  )
}

export default HeadingSelector
