import { RGBColor } from "react-color"

export const isSSR = () => typeof window === "undefined"

export const rgbColor2String = (color: RGBColor) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`

export const animationTimeout = (index: number) => 250 * (index + 2)
export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min
