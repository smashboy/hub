import { Suspense } from "react"
import Dialog from "../Dialog"
import { QueryFunc, SearchDropdownListProps } from "./index"
import SearchDropdownList from "./List"
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material"
import LoadingAnimation from "../LoadingAnimation"

export interface SearchDropdownDialogListProps<I extends Object, F extends QueryFunc<I>>
  extends SearchDropdownListProps<I, F> {
  title: string
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  open: boolean
  onSubmit: () => void
  onClose: () => void
  disableSubmit: boolean
}

const SearchDropdownDialogList = <I extends Object, F extends QueryFunc<I>>({
  open,
  title,
  onClose,
  disableSubmit,
  onSubmit,
  onSearch,
  ...otherProps
}: SearchDropdownDialogListProps<I, F>) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} disabled={disableSubmit}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SearchDropdownDialogList
