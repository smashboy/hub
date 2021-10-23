import { RGBColor } from "react-color"

export const isSSR = () => typeof window === "undefined"

export const rgbColor2String = (color: RGBColor) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`

export const animationTimeout = (index: number) => 250 * (index + 2)
export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

export const capitalizeString = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const countProgress = (total: number, done: number) => Math.floor((100 * done) / total) || 0
