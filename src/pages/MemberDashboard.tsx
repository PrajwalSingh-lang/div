import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, signOut, getTasksByAssignee, getProjects, updateTask, updateUser, User, Task, Project } from '@/lib/auth';
import { FolderKanban, LogOut, CheckCircle2, Clock, AlertCircle, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'member') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
    setProfileForm({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    loadData(user);
  }, [navigate]);

  const loadData = (user: User) => {
    const myTasks = getTasksByAssignee(user.id);
    setTasks(myTasks);
    setProjects(getProjects());
  };

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
    toast.success('Task status updated');
    if (currentUser) {
      loadData(currentUser);
    }
  };

  const handleUpdateProfile = () => {
    if (currentUser) {
      updateUser(currentUser.id, profileForm);
      const updatedUser = { ...currentUser, ...profileForm };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      toast.success('Profile updated successfully');
      setIsProfileDialogOpen(false);
    }
  };

  const stats = {
    totalTasks: tasks.length,
    todoTasks: tasks.filter(t => t.status === 'todo').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
  };

  const recentActivities = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Team Member Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {currentUser?.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Profile Management</DialogTitle>
                  <DialogDescription>Update your personal information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileName">Name</Label>
                    <Input
                      id="profileName"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input
                      id="profileEmail"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profilePassword">Password</Label>
                    <Input
                      id="profilePassword"
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleUpdateProfile} className="w-full">
                    Update Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <FolderKanban className="h-8 w-8 text-blue-600" />
                <p className="text-3xl font-bold">{stats.totalTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-gray-600" />
                <p className="text-3xl font-bold">{stats.todoTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-indigo-600" />
                <p className="text-3xl font-bold">{stats.inProgressTasks}</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Track and update your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No tasks assigned yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task) => {
                        const project = projects.find(p => p.id === task.projectId);
                        return (
                          <TableRow key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedTask(task)}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{project?.title || 'N/A'}</TableCell>
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
                              <Select
                                value={task.status}
                                onValueChange={(value: Task['status']) => handleUpdateTaskStatus(task.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="todo">To Do</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Details */}
            {selectedTask && (
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Title</Label>
                    <p className="mt-1">{selectedTask.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Description</Label>
                    <p className="mt-1 text-sm text-gray-700">{selectedTask.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Priority</Label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                        selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {selectedTask.priority}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Due Date</Label>
                    <p className="mt-1">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest task updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  ) : (
                    recentActivities.map((task) => (
                      <div key={task.id} className="flex gap-3 pb-3 border-b last:border-0">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}