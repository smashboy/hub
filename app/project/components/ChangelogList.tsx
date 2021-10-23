import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { Global } from "@emotion/react"
import { Box, CssBaseline } from "@mui/material"
import { Timeline } from "@mui/lab"
import VirtualListItem from "app/core/components/VirtualListItem"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getChangelogList, { GetChangelogListInput } from "../queries/getChangelogList"
import ChangelogListItem from "./ChangelogListItem"

const getChangelogInput =
  (slug: string) =>
  (page: GetChangelogListInput = { take: 10, skip: 0, slug }) =>
    page

const ChangelogList: React.FC<{ slug: string }> = ({ slug }) => {
  const [feedbackPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getChangelogList,
    getChangelogInput(slug),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  )

  const changelogs = feedbackPages
    .map(({ changelog: changelogList }) => changelogList.map((changelog) => changelog))
    .flat()

  const Components: Components = useMemo(
    () => ({
      List: forwardRef(({ style, children }, listRef) => (
        // @ts-ignore
        <Timeline style={{ padding: 0, ...style, margin: 0 }} ref={listRef}>
          {children}
        </Timeline>
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
        height: "calc(100vh - 400px)",
        margin: "0 auto",
        width: {
          xs: "100%",
          md: "75%",
        },
      }}
    >
      <CssBaseline />
      <Global
        styles={{
          ".MuiTimelineItem-root:before": {
            flex: "none!important",
          },
        }}
      />
      <Virtuoso
        data={changelogs}
        components={Components}
        endReached={handleFetchNext}
        style={{ height: "100%" }}
        itemContent={(_, changelog) => (
          <ChangelogListItem key={changelog.slug} projectSlug={slug} changelog={changelog} />
        )}
      />
    </Box>
  )
}

export default ChangelogList
