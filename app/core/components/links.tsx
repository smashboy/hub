import { useMemo } from "react"
import { Link as BlitzLink, RouteUrlObject } from "blitz"
import { Link as MUILink, Button, ButtonProps, LinkProps } from "@mui/material"
import { alpha } from "@mui/material/styles"

export const RouteLink: React.FC<
  Omit<LinkProps, "href"> & { href: string | RouteUrlObject; withAlpha?: boolean }
> = ({ href, children, withAlpha, color, sx, ...otherProps }) => {
  const initialColor = useMemo(
    // @ts-ignore
    () => (withAlpha ? alpha(color || "white", 0.45) : color),
    [color, withAlpha]
  )

  return (
    <BlitzLink href={href} passHref>
      <MUILink
        {...otherProps}
        color={initialColor}
        underline="none"
        sx={{
          ...sx,
          transition: "all .25s ease-out",
          cursor: "pointer",
          ":hover": {
            color,
          },
        }}
      >
        {children}
      </MUILink>
    </BlitzLink>
  )
}

export const ButtonRouteLink: React.FC<
  { href: string | RouteUrlObject } & Omit<ButtonProps, "href">
> = ({ href, children, ...otherProps }) => (
  <BlitzLink href={href} passHref>
    <Button {...otherProps}>{children}</Button>
  </BlitzLink>
)

export const ButtonWebLink: React.FC<{ href: string } & Omit<ButtonProps, "href">> = ({
  href,
  children,
  ...otherProps
}) => (
  // @ts-ignore
  <Button {...otherProps} href={href} target="_blank" rel="noopener noreferrer" component="a">
    {children}
  </Button>
)
