import { z } from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProps, FORM_ERROR } from "./Form"
import { useState } from "react"
import { DialogActions, DialogContent, DialogTitle, Button, Grid, DialogProps } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import Alert from "./Alert"
import Dialog from "./Dialog"

export interface DiaogFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  title?: string
  open: boolean
  disableCloseOnSubmit?: boolean
  onClose: () => void
  DialogProps?: Omit<DialogProps, "open" | "onClose">
}

function DialogForm<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  title,
  open,
  disableCloseOnSubmit,
  DialogProps,
  onClose,
  ...props
}: DiaogFormProps<S>) {
  const ctx = useForm<z.infer<S>>({
    mode: "onChange",
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: typeof initialValues === "function" ? initialValues() : initialValues,
  })
  const [formError, setFormError] = useState<string | null>(null)

  const disableSubmit = !ctx.formState.isValid

  const handleCloseDialog = () => {
    onClose()
    ctx.reset()
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} {...DialogProps}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <FormProvider {...ctx}>
        <form
          onSubmit={ctx.handleSubmit(async (values) => {
            const result = (await onSubmit(values)) || {}
            const errors = Object.entries(result)

            if (errors.length === 0) {
              if (!disableCloseOnSubmit) handleCloseDialog()
              return
            }

            for (const [key, value] of errors) {
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
          <DialogContent>
            <Grid container spacing={2}>
              {children}

              {formError && (
                <Grid item xs={12}>
                  <Alert severity="error">{formError}</Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <LoadingButton
              color="primary"
              type="submit"
              size="large"
              loading={ctx.formState.isSubmitting}
              disabled={disableSubmit}
            >
              {submitText}
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}

export default DialogForm
