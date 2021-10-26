import { useMemo, forwardRef, useEffect } from "react"
import { useQuery } from "blitz"
import { Components, Virtuoso } from "react-virtuoso"
import { List, Box, ListItemButton, ListItemIcon, Checkbox, ListItemText } from "@mui/material"
import { Option, QueryFunc } from "./index"
import VirtualListItem from "../VirtualListItem"
import { ArrayElement, ReturnAsync } from "app/core/utils/common"

// export type GetFeedbackSearchOptionsInput = {
//   projectSlug: string
//   query?: string
//   take: number
//   skip: number
// }

type SearchDropdownListProps<I extends Object, F extends QueryFunc<I>> = {
  queryFunc: F
  projectSlug: string
  selected: Array<string | number>
  filtered: Array<string | number>
  renderOption: (item: ArrayElement<ReturnAsync<F>>) => Option
  onDataFetched: (items: Array<ArrayElement<ReturnAsync<F>>>) => void
  onSelect: (id: string | number) => void
}

const SearchDropdownList = <I extends Object, F extends QueryFunc<I>>({
  queryFunc,
  projectSlug,
  renderOption,
  filtered,
  selected,
  onDataFetched,
  onSelect,
}: SearchDropdownListProps<I, F>) => {
  const [items] = useQuery(queryFunc, {
    projectSlug,
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
        height: "355px",
      }}
    >
      <Virtuoso
        data={renderOptions}
        components={Components}
        style={{ height: "100%" }}
        itemContent={(index, { id, primary, secondary }) => (
          <ListItemButton onClick={() => onSelect(id)} key={id} divider dense>
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
