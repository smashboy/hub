import { forwardRef, Suspense, useMemo } from "react"
import { BlitzPage } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box, Grid, Fade, Typography } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import { LoadingButton } from "@mui/lab"
import { authConfig } from "app/core/configs/authConfig"
import Layout from "app/core/layouts/Layout"
import FeedbackListItem from "app/project/components/FeedbackListItem"
import FeedbackListPlaceholder from "app/project/components/FeedbackListPlaceholder"
import { useInfiniteQuery, useQuery } from "app/blitzql/hooks/useBlitzqlQuery"

const FeedbackList = () => {
  const [{ authUser }] = useQuery({
    authUser: {
      select: {
        id: true,
      },
    },
  })

  const [feedbackPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    "authUserFeedback",
    {
      take: 15,
      skip: 0,
      where: {
        authorId: authUser!.id,
      },
      select: {
        _count: {
          select: {
            upvotedBy: true,
          },
        },
        projectSlug: true,
        content: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
          },
        },
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const feedback = feedbackPages
    .map(({ items: feedbackList }) =>
      feedbackList.map(({ content, ...otherProps }) => ({ ...otherProps, ...content! }))
    )
    .flat()

  const Components: Components = useMemo(
    () => ({
      List: forwardRef(({ style, children }, listRef) => (
        <List style={{ padding: 0, ...style, margin: 0 }} component="div" ref={listRef}>
          {children}
        </List>
      )),
      item: VirtualListItem,
      Footer: () =>
        hasNextPage ? (
          <LoadingButton
            onClick={() => fetchNextPage()}
            variant="outlined"
            loading={isFetchingNextPage}
            fullWidth
            sx={{ marginTop: 1 }}
          >
            Load More
          </LoadingButton>
        ) : null,
    }),
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  return (
    <Box
      sx={
        {
          // height: "calc(100vh - 70px)",
          // bgcolor: "red",
        }
      }
    >
      <Virtuoso
        useWindowScroll
        data={feedback}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, { projectSlug, ...feedback }) => (
          <FeedbackListItem key={feedback.id} slug={projectSlug} feedback={feedback} />
        )}
      />
    </Box>
  )
}

const AuthUserFeedbackPage: BlitzPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Fade in timeout={500}>
          <Typography variant="h4" color="text.primary" align="center">
            Your Feedback
          </Typography>
        </Fade>
      </Grid>
      <Grid item xs={12}>
        <Suspense fallback={<FeedbackListPlaceholder />}>
          <FeedbackList />
        </Suspense>
      </Grid>
    </Grid>
  )
}

AuthUserFeedbackPage.authenticate = authConfig
AuthUserFeedbackPage.getLayout = (page) => <Layout title="Your feedback">{page}</Layout>

export default AuthUserFeedbackPage
