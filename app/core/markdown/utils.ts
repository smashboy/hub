import { Editor, Element, Transforms, Range } from "slate"
import { isUrl } from "app/core/utils/common"
import { ElementLeafType, ElementType, LinkElement } from "./types"

const LIST_TYPES: ElementType[] = ["num-list", "bul-list"]

export const handleToolbarOptionClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  callback?: () => void
) => {
  event.preventDefault()
  callback?.()
}

export const toggleMark = (editor: Editor, format: ElementLeafType) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: Editor, format: ElementLeafType) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const isBlockActive = (editor: Editor, format: ElementType) => {
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
  })

  return !!match
}

export const toggleBlock = (editor: Editor, format: ElementType) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        // @ts-ignore
        !Editor.isEditor(n) && Element.isElement(n) && n.type
      ),
    split: true,
  })
  const newProperties: Partial<Element> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const withLinks = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element)
  }

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData("text/plain")

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

export const isLinkActive = (editor: Editor) => {
  // @ts-ignore
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  })
  return !!link
}

export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  })
}

export const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) return unwrapLink(editor)

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: "end" })
  }
}

export const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) wrapLink(editor, url)
}
