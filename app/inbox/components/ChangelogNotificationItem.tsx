import { NewChangelogNotification } from "db"
import { Routes, Image, Link } from "blitz"
import { Typography, Box, Card, CardActionArea } from "@mui/material"
import NewChangelogIcon from "@mui/icons-material/LibraryBooks"

const ChangelogNotificationItem: React.FC<{ notification: NewChangelogNotification }> = ({
  notification: { projectName, projectSlug, title, previewImageUrl, changelogSlug },
}) => {
  return (
    <Card>
      <Link href={Routes.ChangelogPage({ slug: projectSlug, changelogSlug })} passHref>
        <CardActionArea
          sx={{
            padding: 1,
            display: "flex",
            textDecoration: "none",
            justifyContent: "flex-start",
            "& .changelog-preview": {
              borderRadius: 1,
            },
          }}
          component="a"
        >
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt={title}
              // layout="responsive"
              width={240}
              height={135}
              className="changelog-preview"
            />
          ) : (
            <NewChangelogIcon fontSize="large" />
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", paddingLeft: 1, width: "100%" }}>
            <Typography variant="h4" component="div" color="primary.main" sx={{ width: "100%" }}>
              {title}
            </Typography>
            <Typography variant="subtitle1" component="div" color="text.secondary">
              {projectName}
            </Typography>
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default ChangelogNotificationItem
