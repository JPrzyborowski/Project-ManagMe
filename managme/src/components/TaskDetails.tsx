import { useState } from 'react'
import { Badge, Button, Form, InputGroup, Modal } from 'react-bootstrap'
import type { Project } from '../models/Project'
import { priorityLabels, stateLabels, type Story } from '../models/Story'
import type { Task } from '../models/Task'
import { fullName, roleLabels, type User } from '../models/User'
import { assignUser, canBeAssigned, finishTask } from '../logic/TaskLogic'
import { priorityColors, stateColors } from '../ui/colors'

type Props = {
  task: Task
  project: Project
  story?: Story
  users: User[]
  onUpdate: (task: Task) => void
  onClose: () => void
}

function formatDateTime(iso?: string): string {
  return iso ? new Date(iso).toLocaleString('pl-PL') : '—'
}

export function TaskDetails({ task, project, story, users, onUpdate, onClose }: Props) {
  const assignableUsers = users.filter(canBeAssigned)
  const assignee = users.find((u) => u.id === task.assigneeId)
  const [selectedUserId, setSelectedUserId] = useState(
    task.assigneeId ?? assignableUsers[0]?.id ?? '',
  )
  const [workedHours, setWorkedHours] = useState(String(task.workedHours))

  function handleAssign() {
    const user = assignableUsers.find((u) => u.id === selectedUserId)
    if (user) onUpdate(assignUser(task, user))
  }

  function handleSaveHours() {
    onUpdate({ ...task, workedHours: Number(workedHours) || 0 })
  }

  function handleFinish() {
    onUpdate(finishTask(task))
  }

  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{task.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{task.description || <span className="text-muted">Brak opisu</span>}</p>
        <dl className="row">
          <dt className="col-sm-4">Projekt</dt>
          <dd className="col-sm-8">{project.name}</dd>
          <dt className="col-sm-4">Historyjka</dt>
          <dd className="col-sm-8">{story?.name ?? '—'}</dd>
          <dt className="col-sm-4">Priorytet</dt>
          <dd className="col-sm-8">
            <Badge bg={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
          </dd>
          <dt className="col-sm-4">Stan</dt>
          <dd className="col-sm-8">
            <Badge bg={stateColors[task.state]}>{stateLabels[task.state]}</Badge>
          </dd>
          <dt className="col-sm-4">Przypisana osoba</dt>
          <dd className="col-sm-8">
            {assignee ? `${fullName(assignee)} (${roleLabels[assignee.role]})` : 'Brak'}
          </dd>
          <dt className="col-sm-4">Przewidywany czas</dt>
          <dd className="col-sm-8">{task.estimatedHours} h</dd>
          <dt className="col-sm-4">Data dodania</dt>
          <dd className="col-sm-8">{formatDateTime(task.createdAt)}</dd>
          <dt className="col-sm-4">Data startu</dt>
          <dd className="col-sm-8">{formatDateTime(task.startedAt)}</dd>
          <dt className="col-sm-4">Data zakończenia</dt>
          <dd className="col-sm-8">{formatDateTime(task.finishedAt)}</dd>
        </dl>

        <Form.Label htmlFor="worked-hours">Zrealizowane roboczogodziny</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            id="worked-hours"
            type="number"
            min={0}
            step={0.5}
            value={workedHours}
            disabled={task.state === 'todo'}
            onChange={(e) => setWorkedHours(e.target.value)}
          />
          <Button
            variant="outline-primary"
            disabled={task.state === 'todo'}
            onClick={handleSaveHours}
          >
            Zapisz
          </Button>
        </InputGroup>
        {task.state === 'todo' && (
          <p className="text-muted small">
            Roboczogodziny można wpisywać po rozpoczęciu zadania (przypisaniu osoby).
          </p>
        )}

        {task.state !== 'done' && (
          <>
            <hr />
            <Form.Label htmlFor="assignee">Przypisz osobę</Form.Label>
            <InputGroup>
              <Form.Select
                id="assignee"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {assignableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {fullName(u)} ({roleLabels[u.role]})
                  </option>
                ))}
              </Form.Select>
              <Button onClick={handleAssign}>Przypisz</Button>
            </InputGroup>
            {task.state === 'todo' && (
              <p className="text-muted small mt-2">
                Przypisanie osoby zmieni stan na „W trakcie” i ustawi datę startu.
              </p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {task.state === 'doing' && (
          <Button variant="success" onClick={handleFinish}>
            Oznacz jako zrobione
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  )
}