import { Typography } from "@mui/material"
import { RenderElementProps } from "slate-react"
import { HeadingElement } from "../types"

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "block":
      return <blockquote {...attributes}>{children}</blockquote>
    case "bul-list":
      return <ul {...attributes}>{children}</ul>
    case "heading":
      const headingElement = element as HeadingElement
      return (
        <Typography variant={`h${headingElement.level}`} color="text.primary">
          {children}
        </Typography>
      )
    case "list-item":
      return <li {...attributes}>{children}</li>
    case "num-list":
      return <ol {...attributes}>{children}</ol>
    default:
      return (
        <Typography variant="body1" {...attributes}>
          {children}
        </Typography>
      )
  }
}

export default Element
