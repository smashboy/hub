import { Box, ClickAwayListener, Grid, IconButton, TextField } from "@mui/material"
import randomcolor from "randomcolor"
import { CustomPicker, ColorChangeHandler } from "react-color"
import { Hue, Saturation, Alpha } from "react-color/lib/components/common"
import RandomIcon from "@mui/icons-material/Cached"
import ArrowTooltip from "./ArrowTooltip"
import { useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { rgbColor2String } from "app/core/utils/blitz"
import { FieldProps } from "./LabeledTextField"

type ColorPickerProps = FieldProps & {
  enableOpacitySlider?: boolean
}

const ColorPickerInput: React.FC<{
  name: string
  watchedValue: string
  label?: string
  handleOpenTooltip: () => void
}> = ({ name, label, watchedValue, handleOpenTooltip }) => {
  const {
    control,
    formState: { isSubmitting },
    setValue,
  } = useFormContext()

  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController({
    // @ts-ignore
    name,
    control,
  })

  label = label || "Select color"

  const handleRandomColor = () =>
    // @ts-ignore
    setValue(name, randomcolor(), { shouldDirty: true, shouldValidate: true })

  return (
    <TextField
      ref={ref}
      {...fieldProps}
      label={label}
      size="small"
      variant="outlined"
      disabled={isSubmitting}
      error={Boolean(error)}
      helperText={error || undefined}
      fullWidth
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <ArrowTooltip title="Random color">
                <IconButton onClick={handleRandomColor} size="small" color="secondary">
                  <RandomIcon />
                </IconButton>
              </ArrowTooltip>
            </Box>
            <ArrowTooltip title="Select color">
              <Box
                bgcolor={watchedValue}
                width={24}
                height={24}
                borderRadius="50%"
                style={{ cursor: "pointer" }}
                onClick={handleOpenTooltip}
              />
            </ArrowTooltip>
          </Box>
        ),
      }}
    />
  )
}

const ColorPickerTooltip = CustomPicker<{ enableOpacitySlider?: boolean }>(
  ({ onChange, enableOpacitySlider, ...otherProps }) => (
    <Grid
      container
      spacing={1}
      sx={{
        width: 300,
        maxWidth: 300,
      }}
    >
      <Grid item xs={11}>
        <Box position="relative" width="100%" height={250} borderRadius={5} overflow="hidden">
          <Saturation onChange={onChange!} {...otherProps} />
        </Box>
      </Grid>
      <Grid item xs={1}>
        <Box position="relative" width="100%" height="100%" borderRadius={5} overflow="hidden">
          <Hue onChange={onChange!} direction="vertical" {...otherProps} />
        </Box>
      </Grid>
      {enableOpacitySlider && (
        <Grid item xs={12}>
          <Box position="relative" width="100%" height={15} borderRadius={5} overflow="hidden">
            <Alpha onChange={onChange!} {...otherProps} />
          </Box>
        </Grid>
      )}
    </Grid>
  )
)

export const ColorPicker: React.FC<ColorPickerProps> = ({
  name,
  label,
  enableOpacitySlider,
  gridProps,
}) => {
  const { control, setValue } = useFormContext()

  const color = useWatch({
    // @ts-ignore
    name,
    control,
  })

  const [openTooltip, setOpenTooltip] = useState(false)

  const handleOpenTooltip = () => setOpenTooltip(true)
  const handleCloseTooptip = () => setOpenTooltip(false)

  const handleChangeColor: ColorChangeHandler = (color) =>
    // @ts-ignore
    setValue(name, enableOpacitySlider ? rgbColor2String(color.rgb) : color.hex, {
      shouldDirty: true,
      shouldValidate: true,
    })

  return (
    <ClickAwayListener onClickAway={handleCloseTooptip}>
      <Grid item xs={12} {...gridProps}>
        <ArrowTooltip
          title={
            <ColorPickerTooltip
              enableOpacitySlider={enableOpacitySlider}
              // @ts-ignore
              color={color as string}
              onChange={handleChangeColor}
            />
          }
          onClose={handleCloseTooptip}
          open={openTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <span>
            <ColorPickerInput
              name={name}
              label={label}
              // @ts-ignore
              watchedValue={color as string}
              handleOpenTooltip={handleOpenTooltip}
            />
          </span>
        </ArrowTooltip>
      </Grid>
    </ClickAwayListener>
  )
}

export default ColorPicker
