import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { Box } from "@mui/material"
import { LoadingButton, Timeline } from "@mui/lab"
import VirtualListItem from "app/core/components/VirtualListItem"
import getChangelogList, { GetChangelogListInput } from "../queries/getChangelogList"
import ChangelogListItem from "./ChangelogListItem"
import { useProject } from "../store/ProjectContext"

const getChangelogInput =
  (slug: string) =>
  (page: Partial<GetChangelogListInput> = { take: 10, skip: 0 }) => ({ ...page, slug })

const ChangelogList = () => {
  const {
    project: { slug },
  } = useProject()

  const [changelogPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getChangelogList,
    getChangelogInput(slug),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  )

  const changelogs = changelogPages
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
        // height: isSM ? undefined : "calc(100vh - 260px)",
        margin: "0 auto",
        // bgcolor: "red",
        width: {
          xs: "100%",
          md: "75%",
        },
      }}
    >
      <Virtuoso
        useWindowScroll
        data={changelogs}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(_, changelog) => (
          <ChangelogListItem key={changelog.slug} changelog={changelog} />
        )}
      />
    </Box>
  )
}

export default ChangelogList
