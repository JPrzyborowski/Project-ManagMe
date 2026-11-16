import type { NewProject, Project } from '../models/Project'
import type { NewStory, Story } from '../models/Story'
import type { Task, TaskFormData } from '../models/Task'

export class ApiService {

  private readonly activeProjectKey = 'managme:activeProjectId'

  


 
async getProjects(): Promise<Project[]> {
  const response = await fetch("http://localhost:3000/api/projects");

  if (!response.ok) {
    throw new Error("Nie udało się pobrać projektów");
  }

  return response.json();
}



  
async createProject(data: NewProject): Promise<Project> {
  const response = await fetch("http://localhost:3000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Nie udało się utworzyć projektu");
  }

  return response.json();
}



async updateProject(project: Project): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/projects/${project.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: project.name,
        description: project.description,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować projektu");
  }
}

  
async deleteProject(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/projects/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć projektu");
  }

  if (localStorage.getItem(this.activeProjectKey) === id) {
    localStorage.removeItem(this.activeProjectKey);
  }
}



  async getActiveProjectId(): Promise<string | undefined> {
    return localStorage.getItem(this.activeProjectKey) ?? undefined
  }

  async setActiveProjectId(id: string): Promise<void> {
    localStorage.setItem(this.activeProjectKey, id)
  }

  async clearActiveProjectId(): Promise<void> {
    localStorage.removeItem(this.activeProjectKey)
  }

 
async getStoriesByProject(projectId: string): Promise<Story[]> {
  const response = await fetch(
    `http://localhost:3000/api/stories?projectId=${encodeURIComponent(projectId)}`
  );

  if (!response.ok) {
    throw new Error("Nie udało się pobrać historyjek");
  }

  return response.json();
}


async createStory(data: NewStory): Promise<Story> {
  const response = await fetch("http://localhost:3000/api/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Nie udało się utworzyć historyjki");
  }

  return response.json();
}



async updateStory(story: Story): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/stories/${story.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: story.name,
        description: story.description,
        priority: story.priority,
        state: story.state,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować historyjki");
  }
}



async deleteStory(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/stories/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć historyjki");
  }
}




async getTaskByProject(projectId: string): Promise<Task[]> {
  const response = await fetch(
    `http://localhost:3000/api/tasks?projectId=${encodeURIComponent(projectId)}`
  );

  if (!response.ok) {
    throw new Error("Nie udało się pobrać zadań");
  }

  return response.json();
}


async createTask(data: TaskFormData): Promise<Task> {
  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Nie udało się utworzyć zadania");
  }

  return response.json();
}


   
async updateTask(task: Task): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/tasks/${task.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: task.name,
        description: task.description,
        priority: task.priority,
        state: task.state,
        estimatedHours: task.estimatedHours,
        workedHours: task.workedHours,
        startedAt: task.startedAt,
        finishedAt: task.finishedAt,
        assigneeId: task.assigneeId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować zadania");
  }
}


    async deleteTask(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/tasks/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć zadania");
  }
}

}

export const api = new ApiService()