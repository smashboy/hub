import { Link, Routes } from "blitz"
import { format } from "date-fns"
import { Card, CardActionArea, CardContent, Grid, Typography, Fade } from "@mui/material"
import {
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
} from "@mui/lab"

type ChangelogListItemProps = {
  changelog: {
    slug: string
    createdAt: Date
    title: string
  }
  projectSlug: string
}

const ChangelogListItem: React.FC<ChangelogListItemProps> = ({
  changelog: { slug, createdAt, title },
  projectSlug,
}) => {
  return (
    <Fade in timeout={500}>
      <TimelineItem
        sx={{
          "&:before": {
            flex: "none!important",
          },
        }}
      >
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Grid container>
            <Grid item xs={12}>
              <Card variant="elevation">
                <Link
                  href={Routes.ChangelogPage({ slug: projectSlug, changelogSlug: slug })}
                  passHref
                >
                  <CardActionArea component="a">
                    <CardContent>
                      <Typography variant="h6" component="span" color="text.primary">
                        {title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
            <Grid item xs={12} sx={{ paddingLeft: 0.5 }}>
              <Typography color="text.secondary" variant="overline">
                {format(createdAt, "dd MMMM, yyyy")}
              </Typography>
            </Grid>
          </Grid>
        </TimelineContent>
      </TimelineItem>
    </Fade>
  )
}

export default ChangelogListItem
