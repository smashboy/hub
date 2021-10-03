import { Skeleton, ListItem, List, ListItemAvatar, ListItemText, Fade } from "@mui/material"
import { random } from "app/core/utils/blitz"

const FirstVariant = () => (
  <ListItem>
    <ListItemAvatar>
      <Skeleton variant="circular" width={45} height={45} />
    </ListItemAvatar>
    <ListItemText
      primary={<Skeleton variant="text" width="25%" />}
      secondary={<Skeleton variant="text" width="50%" />}
    />
  </ListItem>
)

const SecondVariant = () => (
  <ListItem>
    <ListItemAvatar>
      <Skeleton variant="circular" width={45} height={45} />
    </ListItemAvatar>
    <ListItemText
      primary={<Skeleton variant="text" width="25%" />}
      secondary={
        <>
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
        </>
      }
    />
  </ListItem>
)

const items = new Array(10).fill(null).map((_, index) => {
  const Variant = index % 2 === 0 ? SecondVariant : FirstVariant
  return <Variant key={index} />
})

const ProjectsListPlaceholder = () => {
  return (
    <Fade in timeout={750}>
      <List>{items}</List>
    </Fade>
  )
}

export default ProjectsListPlaceholder
