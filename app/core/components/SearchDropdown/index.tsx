import { useState, useEffect } from "react"
import { SvgIcon, Button, ButtonProps, Grid } from "@mui/material"
import { useDebounce } from "use-debounce"
import { ArrayElement, ReturnAsync } from "../../utils/common"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"
import SearchDropdownDialogList from "./DialogList"
import SearchDropdownMenuList from "./MenuList"

export interface Option {
  id: string | number
  primary: string | React.ReactNode
  secondary?: string | React.ReactNode
}

export type SearchOption = {
  id: number | string
  query: string
}

export type QueryFunc<I> = (...args: any[]) => Promise<I[]>

type SearchDropdownProps<I extends Object, F extends QueryFunc<I>> = {
  projectSlug: string
  buttonText: string
  icon: typeof SvgIcon
  queryFunc: F
  renderOption: (item: ArrayElement<ReturnAsync<F>>) => Option
  mapQueryResultToSearchOptions: (item: ArrayElement<ReturnAsync<F>>) => SearchOption
  multiSelect?: boolean
  onSubmit: (selected: Array<string | number>) => void
  buttonProps?: Omit<ButtonProps, "onClick" | "endIcon">
}

export type SearchDropdownListProps<I extends Object, F extends QueryFunc<I>> = {
  queryFunc: F
  projectSlug: string
  selected: Array<string | number>
  filtered: Array<string | number>
  renderOption: (item: ArrayElement<ReturnAsync<F>>) => Option
  onDataFetched: (items: Array<ArrayElement<ReturnAsync<F>>>) => void
  onSelect: (id: string | number) => void
  height?: string | number
}

const SearchDropdown = <I extends Object, F extends QueryFunc<I>>({
  buttonText,
  icon,
  buttonProps,
  renderOption,
  queryFunc,
  mapQueryResultToSearchOptions,
  projectSlug,
}: SearchDropdownProps<I, F>) => {
  const isSM = useIsSmallDevice()

  const Icon = icon

  const [selected, setSelected] = useState<Array<string | number>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const [filtered, setFiltered] = useState<Array<string | number>>([])
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([])
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null)

  const isOpen = Boolean(menuEl)

  const title = `Filter by ${buttonText.toLowerCase()}`

  useEffect(() => {
    const handleSearchQuery = () => {
      const filteredIndexes: Array<string | number> = []

      if (!debouncedSearchQuery) return setFiltered([])

      searchOptions.forEach(({ id, query }) => {
        if (query.indexOf(debouncedSearchQuery.toLowerCase()) > -1) return
        filteredIndexes.push(id)
      })

      setFiltered(filteredIndexes)
    }

    handleSearchQuery()
  }, [debouncedSearchQuery])

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setMenuEl(event.currentTarget)
  const handleCloseMenu = () => {
    setSearchQuery("")
    setFiltered([])
    setSearchOptions([])
    setSelected([])
    setMenuEl(null)
  }

  const handleSetSearchOptions = (items: Array<ArrayElement<ReturnAsync<F>>>) =>
    setSearchOptions(
      items
        .map(mapQueryResultToSearchOptions)
        .map(({ id, query }) => ({ id, query: query.toLowerCase() }))
    )

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.currentTarget.value)

  const handleSelectItem = (id: string | number) => {
    if (selected.includes(id)) return setSelected(selected.filter((s) => s !== id))
    setSelected([...selected, id])
  }

  return (
    <>
      <Grid item xs="auto">
        <Button
          variant="contained"
          color="inherit"
          disableElevation
          {...buttonProps}
          onClick={handleOpenMenu}
          endIcon={isSM ? undefined : <Icon />}
        >
          {isSM ? <Icon /> : buttonText}
        </Button>
      </Grid>
      {!isSM && (
        <SearchDropdownMenuList
          anchorEl={menuEl}
          open={isOpen}
          title={title}
          onSearch={handleSearchInput}
          onClose={handleCloseMenu}
          queryFunc={queryFunc}
          projectSlug={projectSlug}
          renderOption={renderOption}
          selected={selected}
          disableSubmit={selected.length === 0}
          filtered={filtered}
          onDataFetched={handleSetSearchOptions}
          onSelect={handleSelectItem}
        />
      )}
      {isSM && (
        <SearchDropdownDialogList
          open={isOpen}
          title={title}
          onSearch={handleSearchInput}
          onClose={handleCloseMenu}
          queryFunc={queryFunc}
          projectSlug={projectSlug}
          renderOption={renderOption}
          selected={selected}
          disableSubmit={selected.length === 0}
          filtered={filtered}
          onDataFetched={handleSetSearchOptions}
          onSelect={handleSelectItem}
        />
      )}
    </>
  )
}

export default SearchDropdown
