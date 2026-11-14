import { Badge, Card, Col, Row } from 'react-bootstrap'
import { priorityLabels, stateLabels } from '../models/Story'
import type { Task, TaskState } from '../models/Task'
import { fullName, type User } from '../models/User'
import { priorityColors, stateColors } from '../ui/colors'

type Props = {
  tasks: Task[]
  users: User[]
  onOpen: (id: string) => void
}

const columns: TaskState[] = ['todo', 'doing', 'done']

export function KanbanBoard({ tasks, users, onOpen }: Props) {
  return (
    <Row>
      {columns.map((state) => {
        const columnTasks = tasks.filter((t) => t.state === state)
        return (
          <Col key={state} md={4} className="mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>{stateLabels[state]}</strong>
                <Badge bg={stateColors[state]}>{columnTasks.length}</Badge>
              </Card.Header>
              <Card.Body className="d-grid gap-2">
                {columnTasks.length === 0 && <span className="text-muted">Brak zadań</span>}
                {columnTasks.map((task) => {
                  const assignee = users.find((u) => u.id === task.assigneeId)
                  return (
                    <Card key={task.id} body role="button" onClick={() => onOpen(task.id)}>
                      <div className="fw-semibold">{task.name}</div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Badge bg={priorityColors[task.priority]}>
                          {priorityLabels[task.priority]}
                        </Badge>
                        <small className="text-muted">
                          {assignee ? fullName(assignee) : 'Nieprzypisane'}
                        </small>
                      </div>
                    </Card>
                  )
                })}
              </Card.Body>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}