import { Suspense } from "react"
import { Menu, Button, TextField, Grid, Divider } from "@mui/material"
import { QueryFunc } from "./index"
import { SearchDropdownDialogListProps } from "./DialogList"
import LoadingAnimation from "../LoadingAnimation"
import SearchDropdownList from "./List"

interface SearchDropdownMenuListProps<I extends Object, F extends QueryFunc<I>>
  extends SearchDropdownDialogListProps<I, F> {
  anchorEl: Element | null
}

const SearchDropdownMenuList = <I extends Object, F extends QueryFunc<I>>({
  open,
  title,
  onClose,
  onSearch,
  onSubmit,
  disableSubmit,
  anchorEl,
  ...otherProps
}: SearchDropdownMenuListProps<I, F>) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      // sx={{ ".MuiMenu-list": { maxWidth: 350 } }}
    >
      <Grid container rowSpacing={1}>
        <Grid container item xs={12} columnSpacing={1} sx={{ paddingX: 1 }}>
          <Grid item xs={9}>
            <TextField onChange={onSearch} label={title} size="small" fullWidth />
          </Grid>
          <Grid container item xs={3} alignItems="center">
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={disableSubmit}
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
            <SearchDropdownList {...otherProps} />
          </Grid>
        </Suspense>
      </Grid>
    </Menu>
  )
}

export default SearchDropdownMenuList
