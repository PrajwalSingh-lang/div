import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, initializeDefaultData } from '@/lib/auth';
import { CheckCircle2, Users, FolderKanban, BarChart3 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    initializeDefaultData();
    const user = getCurrentUser();
    if (user) {
      // Redirect to appropriate dashboard if already logged in
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'manager') navigate('/manager');
      else navigate('/member');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ProjectHub
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Manage Projects with Confidence
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive project management solution for teams of all sizes. Track tasks, monitor progress, and collaborate seamlessly.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/signin')} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Separate dashboards for Admins, Project Managers, and Team Members with tailored features for each role.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-all hover:shadow-lg">
            <CardHeader>
              <FolderKanban className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Create projects, assign tasks, set deadlines, and track progress with intuitive visual tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-lg">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Monitor team performance, project completion rates, and generate insightful reports.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose ProjectHub?</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Real-time task tracking and updates',
              'Comprehensive user and project management',
              'Intuitive dashboards for all user types',
              'Secure authentication and data protection',
              'Progress monitoring with visual reports',
              'Easy team collaboration and communication',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join thousands of teams managing their projects efficiently with ProjectHub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup')} className="text-lg px-8">
              Create Your Account
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 ProjectHub. All rights reserved.</p>
          <p className="text-sm mt-2">Demo credentials - Admin: admin@projectmanager.com / admin123</p>
        </div>
      </footer>
    </div>
  );
}