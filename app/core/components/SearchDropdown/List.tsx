import { useMemo, forwardRef, useEffect } from "react"
import { useQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box, ListItemButton, ListItemIcon, Checkbox, ListItemText } from "@mui/material"
import { QueryFunc, SearchDropdownListProps } from "./index"
import VirtualListItem from "../VirtualListItem"
import { useProject } from "app/project/store/ProjectContext"

// export type GetFeedbackSearchOptionsInput = {
//   projectSlug: string
//   query?: string
//   take: number
//   skip: number
// }

const SearchDropdownList = <I extends Object, F extends QueryFunc<I>>({
  queryFunc,
  renderOption,
  filtered,
  selected,
  onDataFetched,
  onSelect,
  height,
}: SearchDropdownListProps<I, F>) => {
  const {
    project: { slug },
  } = useProject()

  const [items] = useQuery(queryFunc, {
    projectSlug: slug,
  })

  useEffect(() => {
    // @ts-ignore
    onDataFetched(items)
  }, [items])

  const Components: Components = useMemo(
    () => ({
      List: forwardRef(({ style, children }, listRef) => (
        <List style={{ padding: 0, ...style, margin: 0 }} component="div" ref={listRef}>
          {children}
        </List>
      )),
      item: VirtualListItem,
    }),
    []
  )

  const renderOptions = items.map(renderOption).filter(({ id }) => !filtered.includes(id))

  return (
    <Box
      sx={{
        height: height || "355px",
        // bgcolor: "red",
      }}
    >
      <Virtuoso
        data={renderOptions}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(index, { id, primary, secondary }) => (
          <ListItemButton onClick={() => onSelect(id)} key={id} divider dense focusRipple={false}>
            <ListItemIcon>
              <Checkbox checked={selected.includes(id)} edge="start" tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItemButton>
        )}
      />
    </Box>
  )
}

export default SearchDropdownList
