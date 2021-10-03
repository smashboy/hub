import { forwardRef, useMemo } from "react"
import { useInfiniteQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { Container, List } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import getProjects, { GetProjectsInput } from "../queries/getProjects"
import ProjectListItem from "./ProjectListItem"
import { animationTimeout } from "app/core/utils/blitz"

const getProjectsInput =
  (userCreated: boolean) =>
  (page: GetProjectsInput = { take: 25, skip: 0, userCreated }) =>
    page

const ProjectsList: React.FC<{ userCreated: boolean }> = ({ userCreated }) => {
  const [projectPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getProjects,
    getProjectsInput(userCreated),
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
      // Footer: () =>
      //   isFetchingNextPage ? (
      //     <Box width="100%" display="flex" justifyContent="center" p={2}>
      //       <LoadingAnimation />
      //     </Box>
      //   ) : null,
    }),
    []
  )

  return (
    <Virtuoso
      data={projects}
      components={Components}
      // endReached={() => (hasNextPage ? fetchNextPage() : undefined)}
      style={{ height: "calc(100vh - 435px)" }}
      itemContent={(index, project) => (
        <ProjectListItem
          key={project.slug}
          project={project}
          animationTimeout={animationTimeout(index)}
        />
      )}
    />
  )
}

export default ProjectsList
