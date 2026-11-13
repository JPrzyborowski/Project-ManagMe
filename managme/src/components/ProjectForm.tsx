import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import type { NewProject, Project } from '../models/Project'

type Props = {
  initial?: Project // jeśli podane -> edycja, jeśli nie -> dodawanie
  onSubmit: (data: NewProject) => void
  onCancel: () => void
}

export function ProjectForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // bez tego przeglądarka przeładowałaby stronę
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3" controlId="project-name">
        <Form.Label>Nazwa</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="project-description">
        <Form.Label>Opis</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" className="me-2">
        {initial ? 'Zapisz zmiany' : 'Dodaj projekt'}
      </Button>
      {initial && (
        <Button variant="secondary" onClick={onCancel}>
          Anuluj
        </Button>
      )}
    </Form>
  )
}