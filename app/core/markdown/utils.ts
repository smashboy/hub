import { Editor, Element, Transforms } from "slate"
import { ElementLeafType, ElementType } from "./types"

const LIST_TYPES: ElementType[] = ["num-list", "bul-list"]

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
