import { createContext, useContext, useState, useEffect } from "react"
import { EditorStore } from "./types"

const EditorContext = createContext<EditorStore | null>(null)

export const EditorProvider: React.FC = ({ children }) => {
  const [isFocused, setisFocused] = useState(false)

  const handleSetIsFocused = (newValue: boolean) => setisFocused(newValue)

  return (
    <EditorContext.Provider
      value={{
        isFocused,
        setIsFocused: handleSetIsFocused,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const store = useContext(EditorContext)

  if (!store) throw new Error("useEditor must be used within EditorProvider")

  return store
}
