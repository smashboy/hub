import path from "path"
import prettier from "prettier"
import { writeFile } from "fs/promises"
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  TypeScriptTargetLanguage,
} from "quicktype-core"
import { Schema, AddQueryProps } from "./SchemaBuilder"
import { generateMock } from "@anatine/zod-mock"
import { QueryMethod } from "./types"
import { capitalizeString } from "./utils"

interface ParsedNode
  extends Omit<AddQueryProps<any, any, any, any, any>, "fetchResolver" | "input"> {
  inputSchema?: Object
}

interface ParsedSchema {
  [key: string]: ParsedNode
}

export default class GenerateSchemaTypesPlugin {
  private static pluginName = "GenerateBlitzqlSchemaTypesPlugin"

  apply(compiler: any) {
    if (compiler.options.mode !== "development" || process.env.NODE_ENV === "production") return

    compiler.hooks.afterCompile.tapPromise(
      GenerateSchemaTypesPlugin.pluginName,
      () =>
        new Promise(async (resolve) => {
          try {
            // compilation.fileDependencies.add(this.schemaFilePath)

            const schema = await this.loadSchema()

            await this.generateSchemaTypes(schema)

            resolve(true)
          } catch (error) {
            console.error(error)
          }
        })
    )
  }

  private get schemaFilePath() {
    return path.join(__dirname, "./app/blitzql/types/blitzqlGeneratedTypes.ts")
  }

  private async loadSchema() {
    const module = await import("app/blitzql/schema")

    const builder = module.default

    return builder.schema
  }

  private parseSchema(schema: Partial<Schema>) {
    const parsedSchema: ParsedSchema = {}

    Object.entries(schema).forEach(([key, props]) => {
      // What the actual fuck typescript???
      const { model, method, input } = props!

      const parsedNode: ParsedNode = {
        model,
        method,
      }

      // @ts-ignore
      if (input) parsedNode.inputSchema = generateMock(input)

      parsedSchema[key] = parsedNode
    })

    return parsedSchema
  }

  private createQueryTypes(
    nodeName: string,
    { model, method, partialQuery, nullable }: ParsedNode
  ) {
    const capitalizedModel = capitalizeString(model)
    const capitalizedMethod = capitalizeString(method)

    const queryInputBase = `Prisma.${capitalizedModel}${capitalizedMethod}Args`
    const queryInput = partialQuery ? `Partial<${queryInputBase}>` : queryInputBase

    const queryOutputBase = (nullable?: boolean) =>
      nullable
        ? `Prisma.${capitalizedModel}GetPayload<I | null>`
        : `Prisma.${capitalizedModel}GetPayload<I>`

    const queryOutput =
      method === "findMany" ? `Array<${queryOutputBase()}>` : queryOutputBase(nullable)

    const InputType = `${nodeName}: ${queryInput}`
    const OutputType = `${nodeName}: ${queryOutput}`

    return { InputType, OutputType } as const
  }

  private async generateSchemaTypes(schema: Partial<Schema>) {
    // const targetLanguage = new TypeScriptTargetLanguage()
    // const jsonInput = jsonInputForTargetLanguage(targetLanguage)

    const queryInputs: string[] = []
    const queryOutputHelpers: string[] = []

    Object.entries(this.parseSchema(schema)).forEach(([nodeKey, props]) => {
      const { InputType, OutputType } = this.createQueryTypes(nodeKey, props)

      queryInputs.push(InputType)
      queryOutputHelpers.push(OutputType)
    })

    // await jsonInput.addSource({
    //   name: "BlitzqlSchema",
    //   samples: [JSON.stringify(this.parseSchema(schema))],
    // })

    // const inputData = new InputData()
    // inputData.addInput(jsonInput)

    // const res = await quicktype({
    //   lang: targetLanguage,
    //   inputData,
    //   rendererOptions: {
    //     "just-types": "true",
    //   },
    // })

    await writeFile(
      this.schemaFilePath,
      `
      import { Prisma } from "@prisma/client"

      export interface BlitzqlInputSchema {
        ${queryInputs.join("\n")}
      }

      interface QueryOutputHelper<I> {
        ${queryOutputHelpers.join("\n")}
      }

      export type BlitzqlOutputSchema<I, K = keyof I> = {
        // @ts-ignore
        [k in K]: QueryOutputHelper<I[k]>[k]
      }
      `
    )
  }
}
