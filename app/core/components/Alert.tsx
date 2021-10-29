import { Alert as MUIAlert, AlertProps, Collapse, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export const Alert: React.FC<
  AlertProps & { show?: boolean; onClose?: () => void; closable?: boolean }
> = ({ children, show, onClose, closable, action, ...otherProps }) => {
  const AlertAction = () =>
    closable ? (
      <IconButton aria-label="close" color="secondary" size="small" onClick={onClose}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
    ) : action ? (
      () => action
    ) : null

  return (
    <Collapse in={show || true} unmountOnExit>
      <MUIAlert
        // @ts-ignore
        action={<AlertAction />}
        sx={{
          "& .icon": {
            alignItems: "center",
          },
        }}
        {...otherProps}
      >
        {children}
      </MUIAlert>
    </Collapse>
  )
}

export default Alert
