import db from "db"
import { resolver } from "blitz"
import nodeFetch from "node-fetch"
import superbaseClient from "app/core/superbase/client"
import { UploadProjectLogo } from "../validations"
import { authorizePipe } from "app/guard/helpers"

export default resolver.pipe(
  resolver.zod(UploadProjectLogo),
  authorizePipe("update", "project.settings.general", ({ projectSlug }) => projectSlug),
  async ({ projectId, file, type, bucketId }) => {
    const bucket = superbaseClient.storage.from(bucketId)

    const extension = type.split("/").pop()

    const imagePath = `logos/${projectId}.${extension}`

    const arrayBuffer = await (await nodeFetch(file)).arrayBuffer()

    const { error: uploadError } = await bucket.update(imagePath, arrayBuffer, {
      contentType: type,
    })

    if (uploadError) throw new Error(uploadError.message)

    const { publicURL, error: getPublicUrlError } = await bucket.getPublicUrl(imagePath)

    if (getPublicUrlError) throw new Error(getPublicUrlError.message)
    if (!publicURL) throw new Error("No public image url")

    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        logoUrl: publicURL,
      },
    })

    return publicURL
  }
)
