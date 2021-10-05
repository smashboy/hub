import { useMemo } from "react"
import { useSlate } from "slate-react"
import { Button, BottomNavigationAction } from "@mui/material"
import { MarkButtonProps, BlockButtonProps } from "../types"
import { isMarkActive, toggleMark } from "../utils"

export const MarkButton: React.FC<MarkButtonProps> = ({ icon, format, isMobile }) => {
  const editor = useSlate()

  const Icon = icon

  const color = isMarkActive(editor, format) ? "primary" : "action"

  const handleToggle = () => toggleMark(editor, format)

  if (isMobile)
    return <BottomNavigationAction onClick={handleToggle} icon={<Icon color={color} />} />

  return <Button onClick={handleToggle}>{<Icon color={color} />}</Button>
}

export const BlockButton: React.FC<BlockButtonProps> = ({ icon, format, isMobile }) => {
  const editor = useSlate()

  const Icon = icon

  // const color = useMemo(
  //   () => (isMarkActive(editor, format) ? "primary" : "action"),
  //   [editor, format]
  // )

  if (isMobile) return <BottomNavigationAction icon={<Icon color="action" />} />

  return <Button>{<Icon color="action" />}</Button>
}
