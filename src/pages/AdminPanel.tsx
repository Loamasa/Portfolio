import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Settings, LogOut, Briefcase, BookOpen, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AdminPanel() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("projects");

  // Fetch data
  const { data: projects } = trpc.portfolio.getProjectsByUser.useQuery(undefined, { enabled: isAuthenticated });
  const { data: blogPosts } = trpc.portfolio.getBlogPostsByUser.useQuery(undefined, { enabled: isAuthenticated });
  const { data: settings } = trpc.portfolio.getSettings.useQuery(undefined, { enabled: isAuthenticated });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-8 h-8 text-primary" />
                Admin Panel
              </h1>
              <p className="text-slate-600 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLocation('/cv-manager')}
              >
                <FileText className="w-4 h-4 mr-2" />
                CV Manager
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    await logout();
                    setLocation('/');
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">
              <Briefcase className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="blog">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Portfolio Projects</h2>
              <Button>Add Project</Button>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>
                        {project.isPublished === 1 ? "Published" : "Draft"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{project.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-slate-600 text-center">No projects yet. Create one to showcase your work.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Blog Posts</h2>
              <Button>Create Post</Button>
            </div>

            {blogPosts && blogPosts.length > 0 ? (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {post.isPublished === 1 ? "Published" : "Draft"} · {post.slug}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{post.excerpt}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-slate-600 text-center">No blog posts yet. Start writing to share your insights.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Settings</CardTitle>
                <CardDescription>
                  Customize your portfolio appearance and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Portfolio Title
                  </label>
                  <input
                    type="text"
                    defaultValue={settings?.portfolioTitle || ""}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    placeholder="My Portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Portfolio Description
                  </label>
                  <textarea
                    defaultValue={settings?.portfolioDescription || ""}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    rows={4}
                    placeholder="Describe your portfolio..."
                  />
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

