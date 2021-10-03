import { AuthenticationError, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Box, Button, Fade, Grid } from "@mui/material"
import { RouteLink } from "app/core/components/links"
import { useAtom } from "jotai"
import { authEmailStepStore } from "../store/authEmailStepStore"
import { useStep } from "app/core/hooks/useStep"

export const LoginForm = () => {
  const [loginMutation] = useMutation(login)

  const [{ email }, setEmailStep] = useAtom(authEmailStepStore)

  const { activeStep, blockTransition, handleBack, handleNext } = useStep()

  return (
    <Box minHeight="250px" pt={0.1}>
      <Fade in={activeStep === 0 && !blockTransition} mountOnEnter unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form
              submitText="Next"
              schema={Login.omit({ password: true })}
              initialValues={{ email }}
              onSubmit={(values) => {
                setEmailStep({ email: values.email })
                handleNext()
              }}
            >
              <LabeledTextField name="email" label="Email" type="email" />
            </Form>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <RouteLink href={Routes.SignupPage()} color="primary">
              {"Don't have an account?"}
            </RouteLink>
          </Grid>
        </Grid>
      </Fade>
      <Fade in={activeStep === 1 && !blockTransition} mountOnEnter unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form
              submitText="Login"
              schema={Login.omit({ email: true })}
              initialValues={{ password: "" }}
              onSubmit={async ({ password }) => {
                try {
                  await loginMutation({ email, password })
                } catch (error) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                  } else {
                    return {
                      [FORM_ERROR]:
                        "Sorry, we had an unexpected error. Please try again. - " +
                        error.toString(),
                    }
                  }
                }
              }}
            >
              <LabeledTextField name="password" label="Password" type="password" />
            </Form>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" size="large" onClick={handleBack} fullWidth>
              Back
            </Button>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <RouteLink href={Routes.ForgotPasswordPage()} color="primary">
              Forgot your password?
            </RouteLink>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  )
}

export default LoginForm
