import { useMemo } from "react"
import { dynamic } from "blitz"
import { createEditor } from "slate"
import { withReact } from "slate-react"
import type { Slate as SlateType } from "slate-react"
import { useEditor } from "../EditorContext"
import { withLinks } from "../utils"

const Slate = dynamic(() => import("slate-react").then((mod) => mod.Slate), {
  ssr: false,
}) as unknown as typeof SlateType

const SlateLayer: React.FC = ({ children }) => {
  // @ts-ignore
  const editor = useMemo(() => withLinks(withReact(createEditor())), [])

  const { content, setContent } = useEditor()

  return (
    <Slate value={content} onChange={setContent} editor={editor}>
      {children}
    </Slate>
  )
}

export default SlateLayer
