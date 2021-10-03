import { Box, Grid, GridProps, IconButton, TextField, TextFieldProps } from "@mui/material"
import HideIcon from "@mui/icons-material/Visibility"
import HiddenIcon from "@mui/icons-material/VisibilityOff"
import { useController, useFormContext } from "react-hook-form"
import useToggle from "../hooks/useToggle"

export type FieldProps = {
  name: string
  label: string
  gridProps?: GridProps
}

export type LabeledTextFieldProps = TextFieldProps & FieldProps

export const LabeledTextField: React.FC<LabeledTextFieldProps> = ({
  name,
  gridProps,
  type,
  disabled,
  InputProps,
  helperText,
  ...otherProps
}) => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext()

  const {
    field: { ref, onChange, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const [showPassword, togglePassword] = useToggle()

  return (
    <Grid item xs={12} {...gridProps}>
      <TextField
        ref={ref}
        {...inputProps}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.currentTarget.value) || 0 : e.currentTarget.value)
        }
        type={type === "password" && showPassword ? "text" : type}
        variant="outlined"
        disabled={disabled || isSubmitting}
        error={Boolean(error)}
        helperText={error?.message || error || helperText || undefined}
        fullWidth
        InputProps={{
          ...InputProps,
          endAdornment: type === "password" && (
            <>
              {InputProps?.endAdornment && <Box pr={1}>{InputProps.endAdornment}</Box>}
              <IconButton size="small" onClick={togglePassword}>
                {showPassword ? <HiddenIcon /> : <HideIcon />}
              </IconButton>
            </>
          ),
        }}
        {...otherProps}
      />
    </Grid>
  )
}

export default LabeledTextField
