import { resolver } from "blitz"
import { v4 as uuid } from "uuid"
import nodeFetch from "node-fetch"
import Guard from "app/guard/ability"
import { UploadImage } from "../validations"
import superbaseClient from "app/core/superbase/client"
// import { timeout } from "app/core/utils/common"

export default resolver.pipe(
  resolver.zod(UploadImage),
  Guard.authorizePipe("create", "feedback"),
  async ({ file, type, bucketId }) => {
    // await timeout(3500)

    const bucket = superbaseClient.storage.from(bucketId)

    const extension = type.split("/").pop()

    const imagePath = `images/${uuid()}.${extension}`

    const arrayBuffer = await (await nodeFetch(file)).arrayBuffer()

    const { error: uploadError } = await bucket.upload(imagePath, arrayBuffer, {
      contentType: type,
    })

    if (uploadError) throw new Error(uploadError.message)

    const { publicURL, error: getPublicUrlError } = await bucket.getPublicUrl(imagePath)

    if (getPublicUrlError) throw new Error(getPublicUrlError.message)
    if (!publicURL) throw new Error("No public image url")

    return publicURL
  }
)
