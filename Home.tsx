import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, BookOpen, Settings, LogOut } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  // Hidden admin access: Press 'A' then 'D' then 'M' then 'I' then 'N'
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const adminSequence = ['A', 'D', 'M', 'I', 'N'];
      
      setKeySequence(prev => {
        const newSequence = [...prev, key];
        if (newSequence.length > 5) {
          newSequence.shift();
        }
        
        if (newSequence.join('') === adminSequence.join('')) {
          setShowAdminHint(true);
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setLocation('/admin');
    } else {
      window.location.href = getLoginUrl();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#projects" className="text-slate-600 hover:text-slate-900 font-medium transition">
              Projects
            </a>
            <a href="#blog" className="text-slate-600 hover:text-slate-900 font-medium transition">
              Blog
            </a>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/cv-manager')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  CV Manager
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setLocation('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Pål Schakonat
          </h2>
          <p className="text-2xl text-primary font-semibold mb-4">
            Executive Assistant to the CEO
          </p>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Proactive operator supporting founders with planning, prioritization, and execution. 
            Blend of operations, facilitation, and AI-enabled process design.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => setLocation('/cv-manager')}>
              <FileText className="w-5 h-5 mr-2" />
              Manage CV
            </Button>
            <Button size="lg" variant="outline">
              <a href="#projects" className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                View Projects
              </a>
            </Button>
          </div>
        </div>

        {/* Core Strengths */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
          {[
            { title: "Operating Rhythm", desc: "Plan, prioritize, protect focus time" },
            { title: "Communication Hub", desc: "Draft, route, tidy information" },
            { title: "Meetings", desc: "Agendas, notes, decisions, follow-through" },
            { title: "Projects & Events", desc: "Coordinate cross-functional initiatives" },
            { title: "Problem Solving", desc: "Remove blockers, handle urgent tasks" },
          ].map((strength, i) => (
            <Card key={i} className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  {strength.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600">{strength.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <section id="projects" className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">Featured Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Business Development",
                company: "Secure Privacy",
                desc: "Partnered with founder to align roadmap and drive cross-functional execution via small task teams.",
              },
              {
                title: "Operations Manager",
                company: "Allé Culture House",
                desc: "Built a six-month roadmap to open a new 1,500 m² culture center from empty space to operations.",
              },
              {
                title: "Founder",
                company: "Golden Possum Games AB",
                desc: "Took a game from idea to store launch; managed roadmap, budget, and publisher pitching.",
              },
            ].map((project, i) => (
              <Card key={i} className="bg-white hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="font-semibold">{project.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{project.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">Latest Blog Posts</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Blog posts will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Share insights and experiences through blog posts.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-md p-12 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h3>
          <p className="text-slate-600 mb-6">
            Malmö, Sweden | (+46) 732 632 905 | Pal.Schakonat@gmail.com
          </p>
          <p className="text-slate-600 mb-6">
            Available: Onsite at Lund HQ several days per week
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">LinkedIn</Button>
            <Button variant="outline">Email</Button>
          </div>
        </section>
      </section>

      {/* Hidden Admin Button */}
      {showAdminHint && isAuthenticated && (
        <div className="fixed bottom-8 right-8 animate-pulse">
          <Button
            onClick={handleAdminAccess}
            className="gap-2 bg-slate-900 hover:bg-slate-800"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Pål Schakonat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

