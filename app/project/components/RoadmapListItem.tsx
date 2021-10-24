import { Link, Routes } from "blitz"
import { ListItem, ListItemText, Fade, Box, Grid } from "@mui/material"
import { format } from "date-fns"

type RoadmapListItemProps = {
  projectSlug: string
  roadmap: {
    name: string
    description: string | null
    slug: string
    dueTo: Date | null
  }
}

const RoadmapListItem: React.FC<RoadmapListItemProps> = ({
  roadmap: { name, description, slug, dueTo },
  projectSlug,
}) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <Link href={Routes.RoadmapPage({ slug: projectSlug, roadmapSlug: slug })} passHref>
          <ListItem component="a" button divider>
            <ListItemText
              primary={name}
              secondary={
                <Grid container spacing={1}>
                  {description && (
                    <Grid item xs={12}>
                      {description}
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    {dueTo ? `Due by ${format(dueTo, "dd MMMM, yyyy")}` : "No due date"}
                  </Grid>
                </Grid>
              }
              primaryTypographyProps={{
                variant: "h6",
                component: "div",
                sx: {
                  color: "text.primary",
                },
              }}
              secondaryTypographyProps={{
                component: "div",
              }}
            />
          </ListItem>
        </Link>
      </Box>
    </Fade>
  )
}

export default RoadmapListItem