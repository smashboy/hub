import { useState } from "react"

const TRANSITION_TIMEOUT = 250

export const useStep = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [blockTransition, setBlockTransition] = useState(false)

  const handleNext = () => {
    setBlockTransition(true)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)

    setTimeout(() => {
      setBlockTransition(false)
    }, TRANSITION_TIMEOUT)
  }

  const handleBack = () => {
    setBlockTransition(true)
    setActiveStep((prevActiveStep) => prevActiveStep - 1)

    setTimeout(() => {
      setBlockTransition(false)
    }, TRANSITION_TIMEOUT)
  }

  return { activeStep, blockTransition, handleNext, handleBack }
}
