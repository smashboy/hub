import { Grid, TextField, TextFieldProps } from "@mui/material"
import { DatePicker, DatePickerProps } from "@mui/lab"
import { useController, useFormContext } from "react-hook-form"
import { FieldProps } from "./LabeledTextField"

export type LabeledDatePickerProps = FieldProps &
  Omit<DatePickerProps, "value" | "onChange" | "renderInput"> & {
    textFieldProps?: Omit<TextFieldProps, "value" | "onChange">
  }

const LabeledDatePicker: React.FC<LabeledDatePickerProps> = ({
  name,
  gridProps,
  label,
  textFieldProps,
  disabled,
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

  return (
    <Grid item xs={12} {...gridProps}>
      <DatePicker
        ref={ref}
        label={label}
        {...inputProps}
        {...otherProps}
        disabled={disabled || isSubmitting}
        onChange={(date) => {
          onChange(date)
        }}
        renderInput={(params) => (
          <TextField
            fullWidth
            {...textFieldProps}
            {...params}
            helperText={error?.message || error || textFieldProps?.helperText || undefined}
          />
        )}
      />
    </Grid>
  )
}

export default LabeledDatePicker
