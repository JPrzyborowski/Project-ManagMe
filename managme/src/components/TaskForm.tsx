import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { priorityLabels, type Priority, type Story } from '../models/Story'
import type { Task, TaskFormData } from '../models/Task'

type Props = {
  initial?: Task
  stories: Story[]
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
}

export function TaskForm({ initial, stories, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [storyId, setStoryId] = useState(initial?.storyId ?? stories[0]?.id ?? '')
  const [estimatedHours, setEstimatedHours] = useState(String(initial?.estimatedHours ?? 1))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      priority,
      storyId,
      estimatedHours: Number(estimatedHours) || 0,
    })
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3" controlId="task-name">
        <Form.Label>Nazwa</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="task-description">
        <Form.Label>Opis</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <div className="row">
        <Form.Group className="mb-3 col-md-4" controlId="task-story">
          <Form.Label>Historyjka</Form.Label>
          <Form.Select value={storyId} onChange={(e) => setStoryId(e.target.value)} required>
            {stories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 col-md-4" controlId="task-priority">
          <Form.Label>Priorytet</Form.Label>
          <Form.Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {(Object.keys(priorityLabels) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {priorityLabels[p]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 col-md-4" controlId="task-estimate">
          <Form.Label>Przewidywany czas (h)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            step={0.5}
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
          />
        </Form.Group>
      </div>
      <Button type="submit" className="me-2">
        {initial ? 'Zapisz zmiany' : 'Dodaj zadanie'}
      </Button>
      {initial && (
        <Button variant="secondary" onClick={onCancel}>
          Anuluj
        </Button>
      )}
    </Form>
  )
}