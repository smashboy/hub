import { PickSingleKeyValue } from "app/core/utils/common"
import { createContext, useContext, useState } from "react"
import { ProjectPageProps } from "../helpers"

type Project = PickSingleKeyValue<ProjectPageProps, "project">

type ProjectProviderProps = {
  initialValues: Project
}

type ProjectStore = {
  project: Project
  updateProject: (project: Partial<Project>) => void
}

const ProjectContext = createContext<ProjectStore | null>(null)

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ initialValues, children }) => {
  const [project, setProject] = useState(initialValues)

  const handleUpdateProject = (newProps: Partial<Project>) =>
    setProject((prevState) => ({ ...prevState, ...newProps }))

  return (
    <ProjectContext.Provider value={{ project, updateProject: handleUpdateProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const store = useContext(ProjectContext)

  if (!store) throw new Error("useProject must be used within ProjectProvider")

  return store
}
