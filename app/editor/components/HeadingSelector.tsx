import { Button, BottomNavigationAction } from "@mui/material"
import { HeadingLevel } from "../types"
import { PickSingleKeyValue } from "app/core/utils/common"
import { useSlate } from "slate-react"
import { handleToolbarOptionClick, isHeadingBlockActive, toggleHeadingBlock } from "../utils"

type HeadingOptionsItemProps = { label: string; level: HeadingLevel }

const options: Array<HeadingOptionsItemProps> = [
  // {
  //   label: "H1",
  //   level: 1,
  // },
  // {
  //   label: "H2",
  //   level: 2,
  // },
  // {
  //   label: "H3",
  //   level: 3,
  // },
  {
    label: "H1",
    level: 4,
  },
  {
    label: "H2",
    level: 5,
  },
  {
    label: "H3",
    level: 6,
  },
]

const Item: React.FC<{
  isMobile?: boolean
  label: PickSingleKeyValue<HeadingOptionsItemProps, "label">
  level: HeadingLevel
}> = ({ isMobile, label, level }) => {
  const editor = useSlate()

  const color = isHeadingBlockActive(editor, level) ? "primary" : "secondary"
  const handleToggle = () => toggleHeadingBlock(editor, level)

  if (isMobile)
    return (
      <>
        <BottomNavigationAction
          onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}
          sx={{
            "&.MuiBottomNavigationAction-iconOnly": {
              color: `${color}.main`,
              fontWeight: "bold",
            },
          }}
          icon={label}
        />
      </>
    )

  return (
    <>
      <Button color={color} onMouseDown={(e) => handleToolbarOptionClick(e, handleToggle)}>
        {label}
      </Button>
    </>
  )
}

const HeadingSelector: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  return (
    <>
      {options.map((option) => (
        <Item key={option.label} isMobile={isMobile} {...option} />
      ))}
    </>
  )
}

export default HeadingSelector
