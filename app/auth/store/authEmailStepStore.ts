import { atom } from "jotai"

type AuthEmailStepStore = {
  email: string
}

const authEmailStepStoreInitialValues: AuthEmailStepStore = {
  email: "",
}

export const authEmailStepStore = atom<AuthEmailStepStore>(authEmailStepStoreInitialValues)
