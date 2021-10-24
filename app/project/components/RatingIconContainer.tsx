import { SvgIcon, IconContainerProps, SvgIconProps } from "@mui/material"

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined"
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"

const customIcons: {
  [index: string]: {
    icon: typeof SvgIcon
    label: string
  }
} = {
  1: {
    icon: SentimentVeryDissatisfiedIcon,
    label: "Very Dissatisfied",
  },
  2: {
    icon: SentimentDissatisfiedIcon,
    label: "Dissatisfied",
  },
  3: {
    icon: SentimentSatisfiedIcon,
    label: "Neutral",
  },
  4: {
    icon: SentimentSatisfiedAltIcon,
    label: "Satisfied",
  },
  5: {
    icon: SentimentVerySatisfiedIcon,
    label: "Very Satisfied",
  },
}

type RatingIconContainerProps = IconContainerProps & Pick<SvgIconProps, "fontSize">

export const RatingIconContainer: React.FC<RatingIconContainerProps> = ({
  value,
  fontSize = "large",
  ...other
}) => {
  const Icon = customIcons[value]!.icon

  return (
    <span {...other}>
      <Icon fontSize={fontSize} />
    </span>
  )
}

export default RatingIconContainerProps
