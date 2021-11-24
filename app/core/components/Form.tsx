import { useState, ReactNode, PropsWithoutRef } from "react"
import { FormProvider, useForm, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Grid } from "@mui/material"
import Alert from "./Alert"
import { LoadingButton, LoadingButtonProps } from "@mui/lab"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  updateButton?: boolean
  resetOnSuccess?: boolean
  forceEnableSubmit?: boolean
  ButtonProps?: Omit<LoadingButtonProps, "loading" | "type" | "disabled">
  schema?: S
  onSubmit: (values: z.infer<S>) => void | Promise<void | OnSubmitResult>
  onCancel?: () => void
  initialValues?:
    | (() => UseFormProps<z.infer<S>>["defaultValues"])
    | UseFormProps<z.infer<S>>["defaultValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  updateButton,
  resetOnSuccess,
  forceEnableSubmit,
  initialValues,
  onSubmit,
  onCancel,
  ButtonProps,
  ...props
}: FormProps<S>) {
  const ctx = useForm<z.infer<S>>({
    mode: "onChange",
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: typeof initialValues === "function" ? initialValues() : initialValues,
  })
  const [formError, setFormError] = useState<string | null>(null)

  const disableSubmit = !forceEnableSubmit && (!ctx.formState.isValid || !ctx.formState.isDirty)

  return (
    <FormProvider {...ctx}>
      <form
        onSubmit={ctx.handleSubmit(async (values) => {
          const result = (await onSubmit(values)) || {}

          const errors = Object.entries(result)

          if (errors.length === 0) {
            if (resetOnSuccess)
              ctx.reset(
                updateButton
                  ? values
                  : typeof initialValues === "function"
                  ? // @ts-ignore
                    initialValues()
                  : undefined
              )

            return
          }

          for (const [key, value] of Object.entries(result)) {
            if (key === FORM_ERROR) {
              setFormError(value)
            } else {
              ctx.setError(key as any, {
                type: "submit",
                message: value,
              })
            }
          }
        })}
        {...props}
      >
        <Grid container spacing={2}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {formError && (
            <Grid item xs={12}>
              <Alert severity="error">{formError}</Alert>
            </Grid>
          )}
          <Grid container spacing={1} item xs={12} justifyContent="flex-end">
            {onCancel && (
              <Grid item xs={6} md={2}>
                <Button
                  onClick={onCancel}
                  variant="contained"
                  color="secondary"
                  type="submit"
                  size="medium"
                  disableElevation
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
            )}
            <Grid item xs={updateButton ? 6 : 12} md={updateButton ? 2 : 12}>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                size="medium"
                disableElevation
                {...ButtonProps}
                loading={ctx.formState.isSubmitting}
                fullWidth
                disabled={disableSubmit}
              >
                {submitText}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default Form
