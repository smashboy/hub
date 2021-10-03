import { Tooltip, TooltipProps } from "@mui/material"

export const ArrowTooltip: React.FC<TooltipProps> = ({ children, ...otherProps }) => {
  return (
    <Tooltip arrow {...otherProps}>
      {children}
    </Tooltip>
  )
}

export default ArrowTooltip
