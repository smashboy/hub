import { useState, ReactNode, PropsWithoutRef } from "react"
import { FormProvider, useForm, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Grid } from "@mui/material"
import Alert from "./Alert"
import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { useIsSmallDevice } from "../hooks/useIsSmallDevice"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  updateButton?: boolean
  ButtonProps?: Omit<LoadingButtonProps, "loading" | "type" | "disabled">
  schema?: S
  onSubmit: (values: z.infer<S>) => void | Promise<void | OnSubmitResult>
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
  initialValues,
  onSubmit,
  ButtonProps,
  ...props
}: FormProps<S>) {
  const isSM = useIsSmallDevice()

  const ctx = useForm<z.infer<S>>({
    mode: "onChange",
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: typeof initialValues === "function" ? initialValues() : initialValues,
  })
  const [formError, setFormError] = useState<string | null>(null)

  const disableSubmit = !ctx.formState.isValid

  const enableUpdateButton = updateButton && !isSM

  return (
    <FormProvider {...ctx}>
      <form
        onSubmit={ctx.handleSubmit(async (values) => {
          const result = (await onSubmit(values)) || {}
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
          <Grid container item xs={12} justifyContent={enableUpdateButton ? "flex-end" : "center"}>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disableElevation
              {...ButtonProps}
              loading={ctx.formState.isSubmitting}
              fullWidth={!enableUpdateButton}
              disabled={disableSubmit}
            >
              {submitText}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default Form
