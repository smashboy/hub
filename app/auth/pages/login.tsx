import { BlitzPage } from "blitz"
import { Provider } from "jotai"
import { LoginForm } from "app/auth/components/LoginForm"
import AuthLayout from "../layouts/AuthLayout"

const LoginPage: BlitzPage = () => {
  return (
    <Provider>
      <LoginForm />
    </Provider>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => (
  <AuthLayout title="Log In" pageTitle="LOGIN">
    {page}
  </AuthLayout>
)

export default LoginPage
