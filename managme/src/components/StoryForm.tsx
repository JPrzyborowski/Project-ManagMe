import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import {
  priorityLabels,
  stateLabels,
  type Priority,
  type Story,
  type StoryFormData,
  type StoryState,
} from '../models/Story'

type Props = {
  initial?: Story
  onSubmit: (data: StoryFormData) => void
  onCancel: () => void
}

export function StoryForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [state, setState] = useState<StoryState>(initial?.state ?? 'todo')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ name: name.trim(), description: description.trim(), priority, state })
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3" controlId="story-name">
        <Form.Label>Nazwa</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="story-description">
        <Form.Label>Opis</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <div className="row">
        <Form.Group className="mb-3 col-md-6" controlId="story-priority">
          <Form.Label>Priorytet</Form.Label>
          <Form.Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {(Object.keys(priorityLabels) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {priorityLabels[p]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 col-md-6" controlId="story-state">
          <Form.Label>Stan</Form.Label>
          <Form.Select value={state} onChange={(e) => setState(e.target.value as StoryState)}>
            {(Object.keys(stateLabels) as StoryState[]).map((s) => (
              <option key={s} value={s}>
                {stateLabels[s]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      <Button type="submit" className="me-2">
        {initial ? 'Zapisz zmiany' : 'Dodaj historyjkę'}
      </Button>
      {initial && (
        <Button variant="secondary" onClick={onCancel}>
          Anuluj
        </Button>
      )}
    </Form>
  )
}