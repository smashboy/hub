import { ProjectMemberRole } from "db"
import { Link, Routes } from "blitz"
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fade,
  Grid,
  Typography,
  Chip,
  Box,
} from "@mui/material"

type ProjectListItemProps = {
  project: {
    name: string
    color: string
    slug: string
    logoUrl: string | null
    description: string | null
    role: ProjectMemberRole | null
  }
  // animationTimeout: number
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project: { name, color, slug, logoUrl, description, role },
}) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <Link
          href={Routes.ProjectLandingPage({
            slug,
          })}
          passHref
        >
          <ListItem alignItems="flex-start" component="a" button divider>
            <ListItemAvatar>
              <Avatar
                src={logoUrl || ""}
                alt="name"
                sx={{ bgcolor: color, width: 45, height: 45 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={
                <Grid container rowSpacing={1}>
                  {description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">{description}</Typography>
                    </Grid>
                  )}
                  {role && (
                    <Grid item xs={12}>
                      <Chip label={role.toLowerCase()} size="small" />
                    </Grid>
                  )}
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

export default ProjectListItem
