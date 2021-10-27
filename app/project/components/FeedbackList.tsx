import { ProjectMemberRole, Prisma } from "db"
import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getFeedbackList, { GetFeedbackListInput } from "../queries/getFeedbackList"
import FeedbackListItem from "./FeedbackListItem"
import { FeedbackFilter, FeedbackSortKey } from "../pages/[slug]/feedback"

type FeedbackListProps = {
  slug: string
  role: ProjectMemberRole | null
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
  (
    page: GetFeedbackListInput = {
      take: 10,
      skip: 0,
      slug,
      where: _buildWhereInput(filter),
      orderBy: _buildSortInput(sortKey),
    }
  ) =>
    page

const FeedbackList: React.FC<FeedbackListProps> = ({ slug, role, filter, sortBy }) => {
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
      feedbackList.map(({ content, ...otherProps }) => ({ ...otherProps, ...content }))
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
        isFetchingNextPage ? (
          <Box width="100%" display="flex" justifyContent="center" p={2}>
            <LoadingAnimation />
          </Box>
        ) : null,
    }),
    [isFetchingNextPage]
  )

  const handleFetchNext = () => {
    if (hasNextPage) fetchNextPage()
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 360px)",
        // bgcolor: "red",
      }}
    >
      <Virtuoso
        data={feedback}
        components={Components}
        endReached={handleFetchNext}
        style={{ height: "100%" }}
        itemContent={(_, feedback) => (
          <FeedbackListItem key={feedback.id} slug={slug} role={role} feedback={feedback} />
        )}
      />
    </Box>
  )
}

export default FeedbackList
