import { SvgIconComponent } from "@mui/icons-material"
import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"

export type CustomEditor = BaseEditor & ReactEditor

export type ElementType =
  | "heading"
  | "num-list"
  | "bul-list"
  | "list-item"
  | "block"
  | "link"
  | "image"
  | "paragraph"

export type ElementLeafType = "bold" | "italic" | "underlined" | "code" | "strike"

export type FormattedTextOptions = { [key in ElementLeafType]?: boolean }

export interface FormattedText extends FormattedTextOptions {
  text: string
}

export interface CustomElementBase {
  type: ElementType
  children: CustomText[]
}

export interface CustomText extends FormattedText {}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingElement extends CustomElementBase {
  type: "heading"
  level: HeadingLevel
}

export interface LinkElement extends CustomElementBase {
  type: "link"
  url: string
}

export interface ImageElement extends CustomElementBase {
  type: "image"
  url: string
}

export type MarkButtonProps = {
  icon: SvgIconComponent
  format: ElementLeafType
  isMobile?: boolean
}
export type BlockButtonProps = { icon: SvgIconComponent; format: ElementType; isMobile?: boolean }

export type CustomElement = HeadingElement | LinkElement | ImageElement | CustomElementBase

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
