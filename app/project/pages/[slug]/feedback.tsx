import { authConfig } from "app/core/configs/authConfig"
import { BlitzPage } from "blitz"

const FeedbackPage: BlitzPage = () => {
  return <h1>HELLO</h1>
}

FeedbackPage.authenticate = authConfig

export default FeedbackPage
