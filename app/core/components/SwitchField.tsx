import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Switch,
  SwitchProps,
  Typography,
} from "@mui/material"
import { useController, useFormContext } from "react-hook-form"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"
import { FieldProps } from "./LabeledTextField"

type SwitchFieldProps = FieldProps & {
  helperMessage?: React.ReactNode
  switchProps?: Omit<SwitchProps, "value" | "onChange">
}

const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  gridProps,
  helperMessage,
  switchProps,
}) => {
  const isSM = useIsSmallDevice()

  const {
    control,
    formState: { isSubmitting },
  } = useFormContext()

  const {
    field: { ref, value, onChange, ...fieldProps },
    fieldState: { error },
  } = useController({
    // @ts-ignore
    name,
    control,
  })

  const errorMessage = error?.message || error || helperMessage || undefined

  return (
    <Grid item xs={12} {...gridProps}>
      <FormControl error={Boolean(error)} fullWidth>
        <Grid container item xs={12}>
          <Grid container item xs={10} md={8} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary" component="label">
                {label}
              </Typography>
            </Grid>
            {errorMessage && (
              <Grid item xs={12}>
                <FormHelperText sx={{ marginLeft: 0 }}>{errorMessage}</FormHelperText>
              </Grid>
            )}
          </Grid>
          <Grid container item xs={2} md={4} justifyContent="flex-end">
            <Box paddingRight={isSM ? 0 : 2.5} display="flex" alignItems="center">
              <Switch
                ref={ref}
                {...fieldProps}
                onChange={(e) => onChange(e.target.checked)}
                checked={value}
                color="primary"
                {...switchProps}
                disabled={switchProps?.disabled || isSubmitting}
              />
            </Box>
          </Grid>
        </Grid>
      </FormControl>
    </Grid>
  )
}

export default SwitchField
