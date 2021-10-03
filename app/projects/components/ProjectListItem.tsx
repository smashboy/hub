import { ListItem, ListItemAvatar, ListItemText, Avatar, Fade } from "@mui/material"

type ProjectListItemProps = {
  project: {
    name: string
    color: string
    slug: string
    logoUrl: string | null
    description: string | null
  }
  animationTimeout: number
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project: { name, color, slug, logoUrl, description },
  animationTimeout,
}) => {
  return (
    <Fade in timeout={animationTimeout}>
      <ListItem button divider sx={{ padding: 2 }}>
        <ListItemAvatar>
          <Avatar src={logoUrl || ""} alt="name" sx={{ bgcolor: color, width: 45, height: 45 }} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={description}
          primaryTypographyProps={{
            sx: {
              color: "text.primary",
            },
          }}
          secondaryTypographyProps={{
            sx: {
              color: "text.secondary",
            },
          }}
        />
      </ListItem>
    </Fade>
  )
}

export default ProjectListItem
