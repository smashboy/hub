import { ReactNode } from "react"

export type ElementKey =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "num-list"
  | "bul-list"
  | "list-item"
  | "block"
  | "link"
  | "image"

export type ElementLeafKey = "bold" | "italic" | "underlined" | "code" | "strike"

export type MarkButtonProps = { icon: ReactNode; format: ElementLeafKey }
export type BlockButtonProps = { icon: ReactNode; format: ElementKey }
