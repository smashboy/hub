import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fade,
  Grid,
  Typography,
  Chip,
} from "@mui/material"
import { ProjectMemberRole } from "db"

type ProjectListItemProps = {
  project: {
    name: string
    color: string
    slug: string
    logoUrl: string | null
    description: string | null
    role: ProjectMemberRole | null
  }
  animationTimeout: number
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project: { name, color, slug, logoUrl, description, role },
  animationTimeout,
}) => {
  return (
    <Fade in timeout={animationTimeout}>
      <ListItem alignItems="flex-start" button divider>
        <ListItemAvatar>
          <Avatar src={logoUrl || ""} alt="name" sx={{ bgcolor: color, width: 45, height: 45 }} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <Grid container spacing={2}>
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
            sx: {
              color: "text.primary",
            },
          }}
        />
      </ListItem>
    </Fade>
  )
}

export default ProjectListItem
