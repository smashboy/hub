import { atom } from "jotai"
import { string } from "zod"

type SignupStepsStore = {
  email: string
  username: string
}

const signupStepsStoreInitialValues: SignupStepsStore = {
  email: "",
  username: "",
}

export const signupStepsStore = atom<SignupStepsStore>(signupStepsStoreInitialValues)
