import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, signOut, getProjects, getTasks, getUsers, saveProject, updateProject, saveTask, User, Project, Task } from '@/lib/auth';
import { FolderKanban, LogOut, Plus, Pencil, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    timeline: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed',
  });
  const [taskForm, setTaskForm] = useState({
    projectId: '',
    title: '',
    description: '',
    assigneeId: '',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'manager') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
    loadData();
  }, [navigate]);

  const loadData = () => {
    const allProjects = getProjects();
    const user = getCurrentUser();
    if (user) {
      setProjects(allProjects.filter(p => p.managerId === user.id));
    }
    setTasks(getTasks());
    setUsers(getUsers().filter(u => u.role === 'member'));
  };

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const handleSaveProject = () => {
    if (editingProject) {
      updateProject(editingProject.id, projectForm);
      toast.success('Project updated successfully');
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectForm,
        managerId: currentUser!.id,
        createdAt: new Date().toISOString(),
      };
      saveProject(newProject);
      toast.success('Project created successfully');
    }
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    setProjectForm({ title: '', description: '', timeline: '', status: 'planning' });
    loadData();
  };

  const handleSaveTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskForm,
      createdAt: new Date().toISOString(),
    };
    saveTask(newTask);
    toast.success('Task assigned successfully');
    setIsTaskDialogOpen(false);
    setTaskForm({
      projectId: '',
      title: '',
      description: '',
      assigneeId: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    });
    loadData();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      timeline: project.timeline,
      status: project.status,
    });
    setIsProjectDialogOpen(true);
  };

  const myTasks = tasks.filter(t => projects.some(p => p.id === t.projectId));
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Project Manager Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {currentUser?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <FolderKanban className="h-8 w-8 text-blue-600" />
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-indigo-600" />
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-purple-600" />
                <p className="text-3xl font-bold">{stats.totalTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>Create and manage your projects</CardDescription>
              </div>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingProject(null);
                    setProjectForm({ title: '', description: '', timeline: '', status: 'planning' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                    <DialogDescription>
                      {editingProject ? 'Update project details' : 'Add a new project to manage'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectTitle">Title</Label>
                      <Input
                        id="projectTitle"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectTimeline">Timeline</Label>
                      <Input
                        id="projectTimeline"
                        value={projectForm.timeline}
                        onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                        placeholder="e.g., 3 months, Q1 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectStatus">Status</Label>
                      <Select value={projectForm.status} onValueChange={(value: 'planning' | 'in-progress' | 'completed') => setProjectForm({ ...projectForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProject} className="w-full">
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No projects yet. Create your first project!
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>{project.timeline}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Task Assignment */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Assign and track tasks</CardDescription>
              </div>
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={projects.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                    <DialogDescription>Create and assign a task to a team member</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskProject">Project</Label>
                      <Select value={taskForm.projectId} onValueChange={(value) => setTaskForm({ ...taskForm, projectId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskTitle">Task Title</Label>
                      <Input
                        id="taskTitle"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskDescription">Description</Label>
                      <Textarea
                        id="taskDescription"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskAssignee">Assign To</Label>
                      <Select value={taskForm.assigneeId} onValueChange={(value) => setTaskForm({ ...taskForm, assigneeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskPriority">Priority</Label>
                      <Select value={taskForm.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setTaskForm({ ...taskForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskDueDate">Due Date</Label>
                      <Input
                        id="taskDueDate"
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleSaveTask} className="w-full">
                      Assign Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No tasks yet
                    </TableCell>
                  </TableRow>
                ) : (
                  myTasks.map((task) => {
                    const project = projects.find(p => p.id === task.projectId);
                    const assignee = users.find(u => u.id === task.assigneeId);
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{project?.title}</TableCell>
                        <TableCell>{assignee?.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}