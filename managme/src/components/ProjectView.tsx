import { Tab, Tabs } from 'react-bootstrap'
import type { Project } from '../models/Project'
import type { User } from '../models/User'
import { StoriesView } from './StoriesView'
import { TasksView } from './TasksView'

type Props = {
  project: Project
  user: User
  users: User[]
}

export function ProjectView({ project, user, users }: Props) {
  return (
    <Tabs defaultActiveKey="stories" id="project-tabs" className="mb-4" mountOnEnter unmountOnExit>
      <Tab eventKey="stories" title="Historyjki">
        <StoriesView project={project} user={user} />
      </Tab>
      <Tab eventKey="tasks" title="Zadania">
        <TasksView project={project} users={users} />
      </Tab>
    </Tabs>
  )
}