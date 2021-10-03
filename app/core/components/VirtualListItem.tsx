import { Box } from "@mui/material"

const VirtualListItem: React.FC = ({ children, ...otherProps }) => (
  <Box {...otherProps} style={{ margin: 0, position: "relative" }}>
    {children}
  </Box>
)

export default VirtualListItem
