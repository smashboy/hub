import { Suspense } from "react"
import Dialog from "../Dialog"
import { QueryFunc, SearchDropdownListProps } from "./index"
import SearchDropdownList from "./List"
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material"
import LoadingAnimation from "../LoadingAnimation"
import SwipeableDrawer from "app/core/components/SwipeableDrawer"

export interface SearchDropdownDrawerListProps<I extends Object, F extends QueryFunc<I>>
  extends SearchDropdownListProps<I, F> {
  title: string
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  open: boolean
  onSubmit: () => void
  onClose: () => void
  disableSubmit: boolean
}

const SearchDropdownDrawerList = <I extends Object, F extends QueryFunc<I>>({
  open,
  title,
  onClose,
  disableSubmit,
  onSubmit,
  onSearch,
  ...otherProps
}: SearchDropdownDrawerListProps<I, F>) => {
  return (
    <SwipeableDrawer
      open={open}
      onClose={() => {
        onClose()
        onSubmit()
      }}
      onOpen={() => {}}
    >
      {/* <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ padding: 0 }}> */}
      <Grid container rowSpacing={1}>
        <Grid item xs={12} sx={{ paddingX: 1 }}>
          <TextField onChange={onSearch} label="Search" size="small" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<LoadingAnimation padding={0} />}>
            <SearchDropdownList {...otherProps} height="calc(100vh - 166px)" />
          </Suspense>
        </Grid>
      </Grid>
      {/* </DialogContent> */}
      {/* <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} disabled={disableSubmit}>
          Apply
        </Button>
      </DialogActions> */}
    </SwipeableDrawer>
  )
}

export default SearchDropdownDrawerList
