import { Paper, Box, TextField, TextFieldProps } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

const SearchField: React.FC<TextFieldProps> = (props) => (
  <Paper sx={{ width: "100%" }}>
    <TextField
      {...props}
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <Box paddingRight={1} paddingTop={0.5}>
            <SearchIcon />
          </Box>
        ),
      }}
    />
  </Paper>
)

export default SearchField
