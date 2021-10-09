import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getFeedbackList, { GetFeedbackListInput } from "../queries/getFeedbackList"
import FeedbackListItem from "./FeedbackListItem"

const getFeedbackInput =
  (slug: string) =>
  (page: GetFeedbackListInput = { take: 10, skip: 0, slug }) =>
    page

const FeedbackList: React.FC<{ slug: string }> = ({ slug }) => {
  const [feedbackPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getFeedbackList,
    getFeedbackInput(slug),
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
    []
  )

  const handleFetchNext = () => {
    if (hasNextPage) fetchNextPage()
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 400px)",
      }}
    >
      <Virtuoso
        data={feedback}
        components={Components}
        endReached={handleFetchNext}
        style={{ height: "100%" }}
        itemContent={(index, feedback) => (
          <FeedbackListItem key={feedback.id} slug={slug} feedback={feedback} />
        )}
      />
    </Box>
  )
}

export default FeedbackList
