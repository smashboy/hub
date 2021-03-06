import { ProjectMemberRole, Prisma } from "db"
import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import getFeedbackList, { GetFeedbackListInput } from "../queries/getFeedbackList"
import FeedbackListItem from "./FeedbackListItem"
import { FeedbackFilter, FeedbackSortKey } from "../pages/[slug]/feedback"
import { LoadingButton } from "@mui/lab"
import useIsSmallDevice from "app/core/hooks/useIsSmallDevice"
import { useProject } from "../store/ProjectContext"

type FeedbackListProps = {
  filter: FeedbackFilter
  sortBy: FeedbackSortKey
}

const _buildWhereInput = (filter: FeedbackFilter): Prisma.ProjectFeedbackWhereInput | undefined => {
  const filters = Object.values(filter)

  if (filters.length === 0) return

  return {
    AND: filters,
  }
}

const _buildSortInput = (key: FeedbackSortKey): Prisma.ProjectFeedbackOrderByWithRelationInput => {
  switch (key) {
    case "oldest":
      return {
        createdAt: "asc",
      }
    case "upvoted-more":
      return {
        upvotedBy: {
          _count: "desc",
        },
      }
    case "upvoted-less":
      return {
        upvotedBy: {
          _count: "asc",
        },
      }
    default:
      return {
        createdAt: "desc",
      }
  }
}

const getFeedbackInput =
  (slug: string, filter: FeedbackFilter, sortKey: FeedbackSortKey) =>
  (newPage: Partial<GetFeedbackListInput> = { take: 10, skip: 0 }) => {
    const page: GetFeedbackListInput = {
      ...newPage,
      slug,
      where: _buildWhereInput(filter),
      orderBy: _buildSortInput(sortKey),
    }

    return page
  }

const FeedbackList: React.FC<FeedbackListProps> = ({ filter, sortBy }) => {
  const {
    project: { role, slug },
  } = useProject()

  const isSM = useIsSmallDevice()

  const [feedbackPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getFeedbackList,
    getFeedbackInput(slug, filter, sortBy),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  )

  const feedback = feedbackPages
    .map(({ feedback: feedbackList }) =>
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
      sx={{
        height: isSM ? undefined : "calc(100vh - 360px)",
        // bgcolor: "red",
      }}
    >
      <Virtuoso
        useWindowScroll={isSM}
        data={feedback}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, feedback) => (
          <FeedbackListItem key={feedback.id} slug={slug} role={role} feedback={feedback} />
        )}
      />
    </Box>
  )
}

export default FeedbackList
