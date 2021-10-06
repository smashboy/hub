import { Typography } from "@mui/material"
import { RenderElementProps } from "slate-react"
import { Link } from "@mui/material"
import { HeadingElement, LinkElement } from "../types"

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "block":
      return <blockquote {...attributes}>{children}</blockquote>
    case "bul-list":
      return <ul {...attributes}>{children}</ul>
    case "heading":
      const headingElement = element as HeadingElement
      return (
        <Typography {...attributes} variant={`h${headingElement.level}`} color="text.primary">
          {children}
        </Typography>
      )
    case "list-item":
      return (
        <Typography {...attributes} variant="body1" color="text.secondary" component="li">
          {children}
        </Typography>
      )
    case "num-list":
      return <ol {...attributes}>{children}</ol>
    case "link":
      const linkElemet = element as LinkElement
      return (
        <Link {...attributes} href={linkElemet.url} target="_blank" rel="noopener noreferrer">
          {children}
        </Link>
      )
    default:
      return (
        <Typography {...attributes} variant="body1" color="text.secondary">
          {children}
        </Typography>
      )
  }
}

export default Element
