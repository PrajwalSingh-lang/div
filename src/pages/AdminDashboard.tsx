import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, signOut, getUsers, getProjects, getTasks, saveUser, updateUser, deleteUser, deleteProject, User, Project, Task } from '@/lib/auth';
import { FolderKanban, Users, BarChart3, LogOut, Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as 'admin' | 'manager' | 'member',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setUsers(getUsers());
    setProjects(getProjects());
    setTasks(getTasks());
  };

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const handleSaveUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, userForm);
      toast.success('User updated successfully');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...userForm,
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
      toast.success('User created successfully');
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'member' });
    loadData();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast.success('User deleted successfully');
      loadData();
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
      loadData();
    }
  };

  const stats = {
    totalUsers: users.length,
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* Performance Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <FolderKanban className="h-8 w-8 text-indigo-600" />
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <p className="text-3xl font-bold">{stats.totalTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-green-600" />
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </div>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingUser(null);
                    setUserForm({ name: '', email: '', password: '', role: 'member' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                      {editingUser ? 'Update user information' : 'Create a new user account'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="userName">Name</Label>
                      <Input
                        id="userName"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userPassword">Password</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userRole">Role</Label>
                      <Select value={userForm.role} onValueChange={(value: 'admin' | 'manager' | 'member') => setUserForm({ ...userForm, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Project Manager</SelectItem>
                          <SelectItem value="member">Team Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveUser} className="w-full">
                      {editingUser ? 'Update User' : 'Create User'}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>All projects in the system</CardDescription>
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
                      No projects yet
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
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}