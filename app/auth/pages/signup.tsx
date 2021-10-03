import { BlitzPage } from "blitz"
import { Provider } from "jotai"
import { SignupForm } from "app/auth/components/SignupForm"
import AuthLayout from "../layouts/AuthLayout"

const SignupPage: BlitzPage = () => {
  return (
    <Provider>
      <SignupForm />
    </Provider>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => (
  <AuthLayout title="Sign Up" pageTitle="SIGN UP">
    {page}
  </AuthLayout>
)

export default SignupPage
