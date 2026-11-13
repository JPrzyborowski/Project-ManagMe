import { Button, Table } from 'react-bootstrap'
import type { Project } from '../models/Project'

type Props = {
  projects: Project[]
  onSelect: (id: string) => void
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

export function ProjectList({ projects, onSelect, onEdit, onDelete }: Props) {
  if (projects.length === 0) {
    return <p className="text-muted">Brak projektów. Dodaj pierwszy powyżej.</p>
  }

  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Opis</th>
          <th style={{ width: 260 }}>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>
              <Button size="sm" variant="primary" className="me-2" onClick={() => onSelect(p.id)}>
                Wybierz
              </Button>
              <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(p)}>
                Edytuj
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(p.id)}>
                Usuń
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}