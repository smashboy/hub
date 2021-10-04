import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import getProjects, { GetProjectsInput } from "../queries/getProjects"
import ProjectListItem from "./ProjectListItem"
import { animationTimeout } from "app/core/utils/blitz"
import { useDebounce } from "use-debounce"
import LoadingAnimation from "app/core/components/LoadingAnimation"

const getProjectsInput =
  (searchQuery?: string) =>
  (page: GetProjectsInput = { take: 10, skip: 0, searchQuery }) =>
    page

const ProjectsList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)

  const [projectPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getProjects,
    getProjectsInput(debouncedSearchQuery || undefined),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const projects = projectPages.map(({ projects }) => projects.map((project) => project)).flat()

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
        height: "calc(100vh - 285px)",
      }}
    >
      <Virtuoso
        data={projects}
        components={Components}
        endReached={handleFetchNext}
        style={{ height: "100%" }}
        itemContent={(index, project) => (
          <ProjectListItem
            key={project.slug}
            project={{ ...project, role: project.members[0]?.role ?? null }}
          />
        )}
      />
    </Box>
  )
}

export default ProjectsList
