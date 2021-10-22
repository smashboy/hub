import { dynamic } from "blitz"
import type { Slate as SlateType } from "slate-react"
import { useEditor } from "../EditorContext"

const Slate = dynamic(() => import("slate-react").then((mod) => mod.Slate), {
  ssr: false,
}) as unknown as typeof SlateType

const SlateLayer: React.FC = ({ children }) => {
  const { content, setContent, editor } = useEditor()

  return (
    <Slate value={content} onChange={setContent} editor={editor}>
      {children}
    </Slate>
  )
}

export default SlateLayer
