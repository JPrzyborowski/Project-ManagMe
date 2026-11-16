
import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'

type LoginResponse = {
  token: string
  refreshToken: string
  user: {
    id: string
    login: string
    role: 'admin' | 'devops' | 'developer'
  }
}

type LoginFormProps = {
  onLogin: (data: LoginResponse) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })

      if (!response.ok) {
        throw new Error('Nieprawidłowy login lub hasło')
      }

      const data: LoginResponse = await response.json()
      onLogin(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd logowania')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Logowanie do ManagMe</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Login</Form.Label>
        <Form.Control
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Hasło</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? 'Logowanie...' : 'Zaloguj się'}
      </Button>
    </Form>
  )
}
