import { Skeleton, ListItem, List, ListItemText, Fade } from "@mui/material"

const FirstVariant = () => (
  <ListItem>
    <ListItemText
      primary={<Skeleton variant="text" width="25%" />}
      secondary={<Skeleton variant="text" width="50%" />}
    />
  </ListItem>
)

const SecondVariant = () => (
  <ListItem>
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

const FeedbackListPlaceholder = () => {
  return (
    <Fade in timeout={750}>
      <List>{items}</List>
    </Fade>
  )
}

export default FeedbackListPlaceholder
