import { useState, useEffect } from "react"
import { getLocalStorageItem, setLocalStorageItem } from "../utils/localStorageManager"

const useLocalStorageItem = <T>(storageKey: string, itemKey: string, initialValue?: T) => {
  const [item, setItem] = useState<T | null>(initialValue ?? null)

  useEffect(() => {
    const item = getLocalStorageItem<T>({ storageKey, itemKey })
    if (item) setItem(item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSetItem = (newItem: T, onlyState?: boolean) => {
    setItem(newItem)
    if (onlyState) return
    setLocalStorageItem<T>({ storageKey, itemKey, item: newItem })
  }

  return [item, handleSetItem] as const
}

export default useLocalStorageItem
