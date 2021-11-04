import {
  Button,
  BottomNavigationAction,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import { useState } from "react"
import FileInput from "app/core/components/FileInput"
import Dialog from "app/core/components/Dialog"
import { LoadingButton } from "@mui/lab"
import { handleToolbarOptionClick, insertImage } from "../utils"
import { AllowedFileType } from "app/core/superbase/config"
import { useSlate } from "slate-react"

const ImageUploader: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const editor = useSlate()

  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setImage(null)
  }

  const handleFile = (files: File[]) => {
    const image = files[0] ?? null
    setImage(image)
  }

  const handleUpload = () => {
    const reader = new FileReader()

    setIsLoading(true)

    reader.addEventListener("load", () => {
      const url = reader.result as string
      const fileType = image!.type

      insertImage(editor, url, fileType as AllowedFileType)
      setIsLoading(false)
      handleClose()
    })

    reader.readAsDataURL(image!)
  }

  return (
    <>
      {isMobile ? (
        <BottomNavigationAction
          onMouseDown={(e) => handleToolbarOptionClick(e, handleOpen)}
          icon={<ImageIcon color="action" />}
        />
      ) : (
        <Button onMouseDown={(e) => handleToolbarOptionClick(e, handleOpen)}>
          <ImageIcon color="action" />
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload image</DialogTitle>
        <DialogContent>
          <FileInput
            label="Drag and drop image or click to upload"
            maxSize={20}
            allowedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            onChange={handleFile}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <LoadingButton
            onClick={handleUpload}
            color="primary"
            disabled={!image}
            loading={isLoading}
          >
            Upload
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ImageUploader
