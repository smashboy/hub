import { forwardRef, useMemo } from "react"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box } from "@mui/material"
import VirtualListItem from "app/core/components/VirtualListItem"
import getProjects, { GetProjectsInput } from "../queries/getProjects"
import ProjectListItem from "./ProjectListItem"
import { useDebounce } from "use-debounce"
import { LoadingButton } from "@mui/lab"
import { useInfiniteQuery, useQuery } from "app/blitzql/hooks/useBlitzqlQuery"

const getProjectsInput =
  (searchQuery?: string) =>
  (page: GetProjectsInput = { take: 10, skip: 0 }) => ({ ...page, searchQuery })

const ProjectsList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [{ authUser }] = useQuery({
    authUser: {
      select: {
        id: true,
      },
    },
  })

  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000)

  const [data, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    "authUserProjectsList",
    {
      take: 10,
      skip: 0,
      where: {
        AND: debouncedSearchQuery
          ? [
              {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: searchQuery,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            ]
          : undefined,
      },
      select: {
        name: true,
        color: true,
        slug: true,
        logoUrl: true,
        description: true,
        members: {
          where: {
            userId: authUser?.id,
          },
          select: {
            role: true,
          },
        },
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const projects = data.map(({ items }) => items.map((item) => item)).flat()

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
        height: "calc(100vh - 285px)",
      }}
    >
      <Virtuoso
        data={projects}
        components={Components}
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
