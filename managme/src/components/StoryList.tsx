import { Badge, Button, Table } from 'react-bootstrap'
import { priorityLabels, stateLabels, type Story } from '../models/Story'
import { priorityColors, stateColors } from '../ui/colors'

type Props = {
  stories: Story[]
  onEdit: (story: Story) => void
  onDelete: (id: string) => void
}


export function StoryList({ stories, onEdit, onDelete }: Props) {
  if (stories.length === 0) {
    return <p className="text-muted">Brak historyjek do wyświetlenia.</p>
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Priorytet</th>
          <th>Stan</th>
          <th>Utworzono</th>
          <th style={{ width: 180 }}>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {stories.map((s) => (
          <tr key={s.id}>
            <td>
              <div>{s.name}</div>
              <small className="text-muted">{s.description}</small>
            </td>
            <td>
              <Badge bg={priorityColors[s.priority]}>{priorityLabels[s.priority]}</Badge>
            </td>
            <td>
              <Badge bg={stateColors[s.state]}>{stateLabels[s.state]}</Badge>
            </td>
            <td>{new Date(s.createdAt).toLocaleDateString('pl-PL')}</td>
            <td>
              <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(s)}>
                Edytuj
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(s.id)}>
                Usuń
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
