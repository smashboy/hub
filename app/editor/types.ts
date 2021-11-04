import { SvgIconComponent } from "@mui/icons-material"
import { AllowedFileType, ContentBacketName } from "app/core/superbase/config"
import { BaseEditor, Descendant } from "slate"
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

export interface ImageElement {
  type: "image"
  url: string
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

export interface ListElement {
  type: "bul-list" | "num-list"
  children: Array<{
    type: "list-item"
    children: CustomText[]
  }>
}

export interface LinkElement extends CustomElementBase {
  type: "link"
  url: string
}

export interface ImageElement extends CustomElementBase {
  type: "image"
  imageType?: AllowedFileType
  url: string
}

export type MarkButtonProps = {
  icon: SvgIconComponent
  format: ElementLeafType
  isMobile?: boolean
}
export type BlockButtonProps = { icon: SvgIconComponent; format: ElementType; isMobile?: boolean }

export type CustomElement = HeadingElement | LinkElement | ImageElement | CustomElementBase

export type EditorStore = {
  editor: ReactEditor
  content: Descendant[]
  isFocused: boolean
  disableSubmit: boolean
  submitText: string
  readOnly: boolean
  editVariant: boolean
  height: number
  disablePadding: boolean
  bucketId: ContentBacketName
  setIsFocused: (newValue: boolean) => void
  setContent: (newContent: Descendant[]) => void
  setDisableSubmit: (newValue: boolean) => void
  onSubmit: () => void
  onCancel: () => void
  resetContent: () => void
}

export type EditorProps = Partial<
  Pick<EditorStore, "disableSubmit" | "onCancel" | "height" | "disablePadding">
> &
  Pick<EditorStore, "bucketId"> & {
    initialContent?: Descendant[]
    onSubmit?: (content: Descendant[]) => void
    submitText?: string
    readOnly?: boolean
    updateOnRerender?: boolean
    editVariant?: boolean
    disableReset?: boolean
    closeOnSubmit?: boolean
  }

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
