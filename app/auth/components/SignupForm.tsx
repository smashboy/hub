import { useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { useStep } from "app/core/hooks/useStep"
import { RouteLink } from "app/core/components/links"
import { Box, Button, Fade, Grid, Step, StepLabel, Stepper } from "@mui/material"
import { useAtom } from "jotai"
import { signupStepsStore } from "../store/signupStepsStore"
import checkEmail from "../mutations/checkEmail"
import checkUsername from "../mutations/checkUsername"

const steps = ["Email", "Username", "Passowrd"]

export const SignupForm = () => {
  const [signupMutation] = useMutation(signup)
  const [checkEmailMutation] = useMutation(checkEmail)
  const [checkUsernameMutation] = useMutation(checkUsername)

  const [{ email, username }, setSignupSteps] = useAtom(signupStepsStore)

  const { activeStep, blockTransition, handleBack, handleNext } = useStep()

  return (
    <Box minHeight="250px" pt={0.1}>
      <Box pb={3} px={3}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step} active={index === activeStep} completed={index < activeStep}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Fade in={activeStep === 0 && !blockTransition} mountOnEnter unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form
              submitText="Next"
              schema={Signup.omit({ password: true, username: true })}
              initialValues={{ email }}
              ButtonProps={{
                size: "large",
              }}
              onSubmit={async (values) => {
                try {
                  const newEmail = values.email

                  const isEmailUsed = await checkEmailMutation({ email: newEmail })

                  if (isEmailUsed) return { email: "This email is already being used" }

                  setSignupSteps((prevState) => ({ ...prevState, email: newEmail }))
                  handleNext()
                } catch (error) {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                  }
                }
              }}
            >
              <LabeledTextField name="email" label="Email" type="email" />
            </Form>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <RouteLink href={Routes.LoginPage()} color="primary">
              Already have an account?
            </RouteLink>
          </Grid>
        </Grid>
      </Fade>
      <Fade in={activeStep === 1 && !blockTransition} mountOnEnter unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form
              submitText="Next"
              schema={Signup.omit({ email: true, password: true })}
              initialValues={{ username }}
              ButtonProps={{
                size: "large",
              }}
              onSubmit={async (values) => {
                try {
                  const newUsername = values.username

                  const isUsernameUsed = await checkUsernameMutation({ username: newUsername })

                  if (isUsernameUsed) return { username: "This username is already being used" }

                  setSignupSteps((prevState) => ({ ...prevState, username: newUsername }))
                  handleNext()
                } catch (error) {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                  }
                }
              }}
            >
              <LabeledTextField name="username" label="Username" autoFocus />
            </Form>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              size="large"
              onClick={() => {
                setSignupSteps((prevState) => ({ ...prevState, username: "" }))
                handleBack()
              }}
              fullWidth
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Fade>
      <Fade in={activeStep === 2 && !blockTransition} mountOnEnter unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form
              submitText="Next"
              schema={Signup.omit({ email: true, username: true })}
              initialValues={{ password: "" }}
              ButtonProps={{
                size: "large",
              }}
              onSubmit={async (values) => {
                try {
                  await signupMutation({ email, username, password: values.password })
                } catch (error) {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                  }
                }
              }}
            >
              <LabeledTextField name="password" label="Password" type="password" autoFocus />
            </Form>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" size="large" onClick={handleBack} fullWidth>
              Back
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  )
}

export default SignupForm

// async (values) => {
//   try {
//     await signupMutation(values)
//     props.onSuccess?.()
//   } catch (error) {
//     if (error.code === "P2002" && error.meta?.target?.includes("email")) {
//       // This error comes from Prisma
//       return { email: "This email is already being used" }
//     } else {
//       return { [FORM_ERROR]: error.toString() }
//     }
//   }
// }
