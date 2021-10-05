import { Editor, BaseEditor } from "slate"

export const toggleMark = (editor: BaseEditor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor: BaseEditor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
