import { useState } from "react"

const useToggle = (initState?: boolean): [boolean, () => void] => {
  const [on, setOn] = useState(initState || false)

  const handleToggle = () => setOn(!on)

  return [on, handleToggle]
}

export default useToggle
