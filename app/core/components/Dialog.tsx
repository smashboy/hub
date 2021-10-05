import { Dialog as MUIDialog, DialogProps } from "@mui/material"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"

export const Dialog: React.FC<DialogProps> = ({ children, ...otherProps }) => {
  const isSM = useIsSmallDevice()

  return (
    <MUIDialog maxWidth="md" fullScreen={isSM} fullWidth {...otherProps}>
      {children}
    </MUIDialog>
  )
}

export default Dialog
