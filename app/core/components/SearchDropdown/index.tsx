import { useState, Suspense, useEffect } from "react"
import { SvgIcon, Menu, Button, TextField, ButtonProps, Grid, Divider } from "@mui/material"
import { useDebounce } from "use-debounce"
import LoadingAnimation from "../LoadingAnimation"
import { ArrayElement, ReturnAsync } from "../../utils/common"
import SearchDropdownList from "./List"
import { useIsSmallDevice } from "app/core/hooks/useIsSmallDevice"

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

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setFiltered([])
      setSearchOptions([])
      setSelected([])
    }
  }, [isOpen])

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
  const handleCloseMenu = () => setMenuEl(null)

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
      <Menu
        anchorEl={menuEl}
        open={isOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        // sx={{ ".MuiMenu-list": { maxWidth: 350 } }}
      >
        <Grid container rowSpacing={1}>
          <Grid container item xs={12} columnSpacing={1} sx={{ paddingX: 1 }}>
            <Grid item xs={9}>
              <TextField
                onChange={handleSearchInput}
                label={`Filter by ${buttonText.toLowerCase()}`}
                size="small"
                fullWidth
              />
            </Grid>

            <Grid container item xs={3} alignItems="center">
              <Button
                variant="contained"
                disabled={selected.length === 0}
                disableElevation
                size="small"
              >
                Apply
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider variant="fullWidth" />
          </Grid>
          <Suspense fallback={<LoadingAnimation padding={0} />}>
            <Grid item xs={12}>
              <SearchDropdownList
                queryFunc={queryFunc}
                projectSlug={projectSlug}
                renderOption={renderOption}
                selected={selected}
                filtered={filtered}
                onDataFetched={handleSetSearchOptions}
                onSelect={handleSelectItem}
              />
            </Grid>
          </Suspense>
        </Grid>
      </Menu>
    </>
  )
}

export default SearchDropdown
