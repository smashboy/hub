export interface BlitzqlSchema {
  authUser: {
    model: "user"
    method: "findFirst"
  }
  changelogFeedbackList: {
    model: "changelogFeedback"
    method: "findMany"
  }
  projectMember: {
    model: "projectMember"
    method: "findFirst"
  }
}
