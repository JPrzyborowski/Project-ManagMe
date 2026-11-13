// Model projektu z readme: id, nazwa, opis.
export type Project = {
  id: string
  name: string
  description: string
}

// Dane z formularza - jeszcze bez id (id nadaje API przy tworzeniu).
export type NewProject = Omit<Project, 'id'>