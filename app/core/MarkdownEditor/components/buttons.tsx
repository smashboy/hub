import { useSlate } from "slate-react"
import { Button } from "@mui/material"
import { MarkButtonProps, BlockButtonProps } from "../types"

export const MarkButton: React.FC<MarkButtonProps> = ({ icon }) => {
  const editor = useSlate()

  return <Button>{icon}</Button>
}

export const BlockButton: React.FC<BlockButtonProps> = ({ icon }) => {
  const editor = useSlate()

  return <Button>{icon}</Button>
}
