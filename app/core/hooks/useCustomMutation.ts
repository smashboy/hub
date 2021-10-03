import { useMutation } from "blitz"
import useNotifications from "./useNotifications"
import { UseMutationOptions, MutateFunction, UseMutationResult } from "react-query"

interface UseCustomMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  disableErrorNotification?: boolean
  successNotification?: string
}

type MutationFunction<TData, TVariables> = (variables: TVariables, ctx?: any) => Promise<TData>

const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  fn: MutationFunction<TData, TVariables>,
  {
    successNotification,
    disableErrorNotification,
    onError,
    onSuccess,
    ...otherProps
  }: UseCustomMutationOptions<TData, TError, TVariables, TContext>
): [
  MutateFunction<TData, TError, TVariables, TContext>,
  Omit<UseMutationResult<TData, TError>, "mutate" | "mutateAsync">
] => {
  const { notify } = useNotifications()

  const showError = (error: string) => {
    if (!disableErrorNotification) {
      notify(error, {
        variant: "error",
      })
    }
  }

  const showSuccessMessage = () => {
    if (successNotification) {
      notify(successNotification, {
        variant: "success",
      })
    }
  }

  const handleOnSuccess = async (data: TData, variables: TVariables, context: TContext) => {
    showSuccessMessage()
    await onSuccess?.(data, variables, context)
  }

  const handleOnError = async (data: any, variables: TVariables, context: TContext) => {
    showError(data.toString())
    await onError?.(data, variables, context)
  }

  return useMutation(fn, {
    onSuccess: handleOnSuccess,
    onError: handleOnError,
    ...otherProps,
  })
}

export default useCustomMutation
