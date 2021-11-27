import { useContext, createContext } from "react"

export interface BlitzqlContextStore {
  resolvers: {
    query: (...args: any) => any
    mutation: (...args: any) => any
  }
}

const BlitzqlContext = createContext<BlitzqlContextStore | null>(null)

export interface BlitzqlProviderProps extends BlitzqlContextStore {}

export const BlitzqlProvider: React.FC<BlitzqlProviderProps> = ({ children, ...otherProps }) => (
  <BlitzqlContext.Provider value={otherProps}>{children}</BlitzqlContext.Provider>
)

export const useInternalBlitzql = () => {
  const store = useContext(BlitzqlContext)

  // TODO: Provide more user friendly message
  if (!store) throw new Error("useInternalBlitzql must be used within BlitzqlProvider")

  return store
}
