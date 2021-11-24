import path from "path"
import { readdir, stat, writeFile, readFile } from "fs/promises"
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  TypeScriptTargetLanguage,
} from "quicktype-core"
import { Schema, AddQueryProps } from "./SchemaBuilder"
import { generateMock } from "@anatine/zod-mock"

interface ParsedNode {
  model: string
  method: string
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
      (compilation) =>
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

  private createNodeType(nodeName: string, { model, method }: ParsedNode) {
    const template = `${nodeName}: {
      model: "${model}"
      method: "${method}"
    }`

    return template
  }

  private async generateSchemaTypes(schema: Partial<Schema>) {
    // const targetLanguage = new TypeScriptTargetLanguage()
    // const jsonInput = jsonInputForTargetLanguage(targetLanguage)

    const res: string[] = []

    Object.entries(this.parseSchema(schema)).forEach(([nodeKey, props]) => {
      res.push(this.createNodeType(nodeKey, props))
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
      `export interface BlitzqlSchema {
        ${res.join("\n")}
      }`
    )
  }
}
