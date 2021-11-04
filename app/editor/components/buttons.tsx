import { useSlate } from "slate-react"
import { Button, BottomNavigationAction } from "@mui/material"
import { MarkButtonProps, BlockButtonProps } from "../types"
import {
  handleToolbarOptionClick,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from "../utils"

export const MarkButton: React.FC<MarkButtonProps> = ({ icon, format, isMobile }) => {
  const editor = useSlate()

  const Icon = icon

  const color = isMarkActive(editor, format) ? "primary" : "action"

  const handleToggle = () => toggleMark(editor, format)

  if (isMobile)
    return (
      <BottomNavigationAction
        onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}
        icon={<Icon color={color} />}
      />
    )

  return (
    <Button onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}>
      {<Icon color={color} />}
    </Button>
  )
}

export const BlockButton: React.FC<BlockButtonProps> = ({ icon, format, isMobile }) => {
  const editor = useSlate()

  const Icon = icon

  const color = isBlockActive(editor, format) ? "primary" : "action"

  const handleToggle = () => toggleBlock(editor, format)

  if (isMobile)
    return (
      <BottomNavigationAction
        onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}
        icon={<Icon color={color} />}
      />
    )

  return (
    <Button onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}>
      {<Icon color={color} />}
    </Button>
  )
}
