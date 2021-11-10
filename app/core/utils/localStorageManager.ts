import { isSSR } from "./blitz"

export type LocalStorageItemPropsType = {
  storageKey: string
  itemKey: string
}

export type WriteStoragePropsType<ItemType> = {
  storageKey: string
  storage: LocalStorageType<ItemType>
}

export type SetLocalStorageItemPropsType<ItemType> = {
  item: ItemType | ((item: ItemType | null) => ItemType)
} & LocalStorageItemPropsType

export type LocalStorageType<ItemType> = {
  [key: string]: ItemType
}

export const getLocalStorage = <T>(key: string): LocalStorageType<T> | null => {
  if (isSSR()) return null

  const store = localStorage.getItem(key)

  if (store === null) return store

  return JSON.parse(store)
}

export const setLocalStorage = <T>({ storageKey, storage }: WriteStoragePropsType<T>) => {
  if (isSSR()) return
  localStorage.setItem(storageKey, JSON.stringify(storage))
}

export const setLocalStorageItem = <T>({
  storageKey,
  itemKey,
  item,
}: SetLocalStorageItemPropsType<T>) => {
  let storage = getLocalStorage(storageKey)

  if (storage === null) storage = {}

  if (typeof item === "function") {
    const previousItem = getLocalStorageItem<T>({ storageKey, itemKey })
    // @ts-ignore
    storage[itemKey] = item(previousItem)
  } else {
    storage[itemKey] = item
  }

  setLocalStorage({ storageKey, storage })
}

export const getLocalStorageItem = <T>({
  storageKey,
  itemKey,
}: LocalStorageItemPropsType): T | null => {
  const storage = getLocalStorage<T>(storageKey)

  if (storage === null) return storage

  return storage[itemKey] || null
}

export const removeLocalStorageItem = ({ storageKey, itemKey }: LocalStorageItemPropsType) => {
  const storage = getLocalStorage(storageKey)

  if (storage) {
    delete storage[itemKey]

    if (Object.keys(storage).length === 0) return localStorage.removeItem(storageKey)

    setLocalStorage({ storageKey, storage })
  }
}
