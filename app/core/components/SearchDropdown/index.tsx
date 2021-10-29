import { useState, useEffect, useMemo } from "react"
import { SvgIcon, Button, ButtonProps, Grid, Badge } from "@mui/material"
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
  // multiSelect?: boolean
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
  onSubmit,
  mapQueryResultToSearchOptions,
  projectSlug,
}: SearchDropdownProps<I, F>) => {
  const isSM = useIsSmallDevice()

  const Icon = icon

  const [selected, setSelected] = useState<Array<string | number>>([])
  const [applied, setApplied] = useState<Array<string | number>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const [filtered, setFiltered] = useState<Array<string | number>>([])
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([])
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null)

  const open = useMemo(() => Boolean(menuEl), [menuEl])
  const title = useMemo(() => `Filter by ${buttonText.toLowerCase()}`, [buttonText])

  const disableApply = useMemo(() => {
    if (selected.length === 0 && applied.length > 0) return false
    if (selected.length === 0 && applied.length === 0) return true
    return false
  }, [selected, applied])

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

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuEl(event.currentTarget)
    setSelected(applied)
  }

  const handleCloseMenu = () => {
    setMenuEl(null)
    setTimeout(() => {
      setSearchQuery("")
      setFiltered([])
      setSearchOptions([])
      setSelected([])
    }, 150)
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

  const handleApplyResults = () => {
    onSubmit(selected)
    setApplied(selected)
    setSearchQuery("")
    setMenuEl(null)
    setFiltered([])
    setSearchOptions([])
  }

  return (
    <>
      <Grid item xs="auto">
        <Badge badgeContent={applied.length} color="primary">
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            {...buttonProps}
            onClick={handleOpenMenu}
            endIcon={isSM ? undefined : <Icon />}
          >
            {isSM ? <Icon /> : buttonText}
          </Button>
        </Badge>
      </Grid>
      {!isSM && (
        <SearchDropdownMenuList
          anchorEl={menuEl}
          open={open}
          title={title}
          onSearch={handleSearchInput}
          onClose={handleCloseMenu}
          queryFunc={queryFunc}
          projectSlug={projectSlug}
          renderOption={renderOption}
          selected={selected}
          disableSubmit={disableApply}
          filtered={filtered}
          onSubmit={handleApplyResults}
          onDataFetched={handleSetSearchOptions}
          onSelect={handleSelectItem}
        />
      )}
      {isSM && (
        <SearchDropdownDialogList
          open={open}
          title={title}
          onSearch={handleSearchInput}
          onClose={handleCloseMenu}
          queryFunc={queryFunc}
          projectSlug={projectSlug}
          renderOption={renderOption}
          selected={selected}
          disableSubmit={disableApply}
          filtered={filtered}
          onSubmit={handleApplyResults}
          onDataFetched={handleSetSearchOptions}
          onSelect={handleSelectItem}
        />
      )}
    </>
  )
}

export default SearchDropdown
