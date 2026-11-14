import { Badge, Button, Table } from 'react-bootstrap'
import { priorityLabels, stateLabels, type Story } from '../models/Story'
import type { Task } from '../models/Task'
import { fullName, type User } from '../models/User'
import { priorityColors, stateColors } from '../ui//colors'

type Props = {
  tasks: Task[]
  stories: Story[]
  users: User[]
  onDetails: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, stories, users, onDetails, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="text-muted">Brak zadań do wyświetlenia.</p>
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Historyjka</th>
          <th>Priorytet</th>
          <th>Stan</th>
          <th>Osoba</th>
          <th>Czas (h)</th>
          <th style={{ width: 250 }}>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => {
          const story = stories.find((s) => s.id === t.storyId)
          const assignee = users.find((u) => u.id === t.assigneeId)
          return (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{story?.name ?? '—'}</td>
              <td>
                <Badge bg={priorityColors[t.priority]}>{priorityLabels[t.priority]}</Badge>
              </td>
              <td>
                <Badge bg={stateColors[t.state]}>{stateLabels[t.state]}</Badge>
              </td>
              <td>{assignee ? fullName(assignee) : '—'}</td>
              <td>
                {t.workedHours} / {t.estimatedHours}
              </td>
              <td>
                <Button size="sm" variant="primary" className="me-2" onClick={() => onDetails(t.id)}>
                  Szczegóły
                </Button>
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(t)}>
                  Edytuj
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(t.id)}>
                  Usuń
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}