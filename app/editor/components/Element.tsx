import { useMutation } from "blitz"
import { useEffect, useState } from "react"
import { CircularProgress, Paper, Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react"
import { Link } from "@mui/material"
import { HeadingElement, LinkElement, ImageElement } from "../types"
import { Transforms } from "slate"
import uploadImage from "../mutations/uploadImage"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import { useEditor } from "../EditorContext"

const ImageContainer = styled("div")({
  position: "relative",
  marginLeft: 5,
})

const StyledImage = styled("img")({
  display: "block",
  maxWidth: "100%",
  maxHeight: "30em",
  borderRadius: 4,
  // box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
})

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "block":
      return (
        <Paper
          {...attributes}
          sx={{
            marginX: {
              xs: 0,
              md: 4,
            },
            marginY: 2,
            padding: 2,
            bgcolor: "background.default",
          }}
          // variant="outlined"
          component="blockquote"
        >
          <Typography variant="body1" color="text.primary">
            {children}
          </Typography>
        </Paper>
      )
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
        <Typography {...attributes} variant="body1" color="text.primary" component="li">
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
    case "image":
      const imageElemet = element as ImageElement
      return (
        <EditorImage attributes={attributes} element={imageElemet}>
          {children}
        </EditorImage>
      )
    default:
      return (
        <Typography {...attributes} variant="body1" color="text.primary">
          {children}
        </Typography>
      )
  }
}

export default Element

const EditorImage: React.FC<{ element: ImageElement; attributes: any }> = ({
  attributes,
  children,
  element,
}) => {
  const { imageType, url } = element

  const { bucketId } = useEditor()

  const [uploadImageMutation, { isLoading, error }] = useCustomMutation(uploadImage, {})

  const editor = useSlateStatic()

  useEffect(() => {
    const handleUploadImage = async () => {
      if (imageType) {
        const newUrl = await uploadImageMutation({
          file: url,
          type: imageType,
          bucketId,
        })

        const path = ReactEditor.findPath(editor, element)
        Transforms.removeNodes(editor, { at: path })

        const updateNode: ImageElement = { type: "image", url: newUrl, children: [{ text: "" }] }

        Transforms.insertNodes(editor, updateNode, { at: path })
      }
    }

    handleUploadImage()
  }, [])

  useEffect(() => {
    if (error) {
      const path = ReactEditor.findPath(editor, element)
      Transforms.removeNodes(editor, { at: path })
    }
  }, [error])

  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      <ImageContainer contentEditable={false}>
        {isLoading ? (
          <Typography variant="subtitle1" color="text.primary" component="div">
            Uploading image <CircularProgress sx={{ marginLeft: 1 }} size={16} />
          </Typography>
        ) : (
          <StyledImage
            src={url}
            alt=""
            sx={{ boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none" }}
          />
        )}
        {/* <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <Icon>delete</Icon>
        </Button> */}
      </ImageContainer>
      {children}
    </div>
  )
}
