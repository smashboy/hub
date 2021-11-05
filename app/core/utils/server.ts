import { Descendant } from "slate"
import { CustomElement, ImageElement } from "app/editor/types"
import superbaseClient from "../superbase/client"
import { v4 as uuid } from "uuid"
import nodeFetch from "node-fetch"

export type ContentBacketName = "feedback" | "changelogs" | "messages"

export const uploadContentImages = async (content: Descendant[], bucketName: ContentBacketName) => {
  const processedContent: Descendant[] = []

  const bucket = superbaseClient.storage.from(bucketName)

  for (const index in content) {
    const element = content[index] as CustomElement
    if (element?.type === "image") {
      const imageElement = element as ImageElement

      if (imageElement.imageType) {
        const extension = imageElement.imageType.split("/").pop()

        const imagePath = `images/${uuid()}.${extension}`

        const arrayBuffer = await (await nodeFetch(imageElement.url)).arrayBuffer()

        const { error: uploadError } = await bucket.upload(imagePath, arrayBuffer, {
          contentType: imageElement.imageType,
        })

        if (uploadError) throw new Error(uploadError.message)

        const { publicURL, error: getPublicUrlError } = await bucket.getPublicUrl(imagePath)

        if (getPublicUrlError) throw new Error(getPublicUrlError.message)
        if (!publicURL) throw new Error("No public image url")

        processedContent[index] = {
          type: "image",
          url: publicURL,
          children: [{ text: "" }],
        }
      } else {
        processedContent[index] = imageElement
      }
    } else if (element?.type) {
      const newContent = await uploadContentImages(element.children, bucketName)

      processedContent[index] = {
        ...element,
        // @ts-ignore
        children: newContent,
      }
    } else {
      processedContent[index] = element
    }
  }

  return processedContent
}
