export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  timeline: string;
  managerId: string;
  status: 'planning' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

// Initialize default admin user
export const initializeDefaultData = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@projectmanager.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
  }
};

// User Management
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const deleteUser = (userId: string) => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(users));
};

// Authentication
export const signUp = (name: string, email: string, password: string, role: User['role']): User | null => {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return null; // Email already exists
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  
  saveUser(newUser);
  return newUser;
};

export const signIn = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const signOut = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Project Management
export const getProjects = (): Project[] => {
  const projects = localStorage.getItem('projects');
  return projects ? JSON.parse(projects) : [];
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem('projects', JSON.stringify(projects));
};

export const updateProject = (projectId: string, updates: Partial<Project>) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem('projects', JSON.stringify(projects));
  }
};

export const deleteProject = (projectId: string) => {
  const projects = getProjects().filter(p => p.id !== projectId);
  localStorage.setItem('projects', JSON.stringify(projects));
  // Also delete associated tasks
  const tasks = getTasks().filter(t => t.projectId !== projectId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Task Management
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTask = (task: Task) => {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const updateTask = (taskId: string, updates: Partial<Task>) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

export const deleteTask = (taskId: string) => {
  const tasks = getTasks().filter(t => t.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return getTasks().filter(t => t.assigneeId === assigneeId);
};

export const getTasksByProject = (projectId: string): Task[] => {
  return getTasks().filter(t => t.projectId === projectId);
};