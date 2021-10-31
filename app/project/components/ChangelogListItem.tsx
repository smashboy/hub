import { Link, Routes, Image } from "blitz"
import { format } from "date-fns"
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Fade,
  CardMedia,
  Box,
  useTheme,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import {
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
} from "@mui/lab"
import useIsSmallDevice from "app/core/hooks/useIsSmallDevice"

type ChangelogListItemProps = {
  changelog: {
    slug: string
    createdAt: Date
    title: string
    previewImageUrl: string | null
  }
  projectSlug: string
}

const ChangelogListItem: React.FC<ChangelogListItemProps> = ({
  changelog: { slug, createdAt, title, previewImageUrl },
  projectSlug,
}) => {
  const isSM = useIsSmallDevice()

  const theme = useTheme()

  const isLargeImageVariant = Boolean(previewImageUrl && !isSM)

  return (
    <Fade in timeout={500}>
      <TimelineItem
        sx={{
          "&:before": {
            flex: "none!important",
            padding: 0,
          },
        }}
      >
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Grid container rowSpacing={1}>
            {/* {previewImageUrl && (
              <Grid
                item
                xs={12}
                sx={{
                  "& .changelog-preview": {
                    borderRadius: 1,
                  },
                }}
              >
                <Image
                  src={previewImageUrl}
                  alt={title}
                  layout="responsive"
                  width={320}
                  height={180}
                  className="changelog-preview"
                />
              </Grid>
            )} */}
            <Grid item xs={12}>
              <Card variant="elevation">
                <Link
                  href={Routes.ChangelogPage({ slug: projectSlug, changelogSlug: slug })}
                  passHref
                >
                  <CardActionArea component="a">
                    {previewImageUrl && (
                      <CardMedia sx={{ maxHeight: "240px" }}>
                        <div style={{ position: "relative", width: "100%", height: "100%" }}>
                          <Image
                            src={previewImageUrl}
                            alt={title}
                            layout="responsive"
                            width={320}
                            height={180}
                            // className="changelog-preview"
                          />
                        </div>
                      </CardMedia>
                    )}
                    <CardContent
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        padding: isLargeImageVariant ? 1 : undefined,
                      }}
                    >
                      <Box
                        sx={
                          isLargeImageVariant
                            ? {
                                bgcolor: alpha(theme.palette.background.paper, 0.75),
                                width: "97.8%",
                                padding: 1,
                                borderRadius: 1,
                              }
                            : undefined
                        }
                      >
                        <Typography variant="h6" component="span" color="text.primary">
                          {title}
                        </Typography>
                      </Box>
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
