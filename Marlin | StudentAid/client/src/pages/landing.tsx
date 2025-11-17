import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckSquare, Zap, Calendar, Users, Search, ArrowRight } from "lucide-react";
// Removed: import heroImage from "@assets/generated_images/Students_collaborating_in_bright_study_space_1ca58873.png";

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "Rich text editor with folders, tags, and powerful organization tools to keep all your study materials in one place.",
    },
    {
      icon: CheckSquare,
      title: "Task Dashboard",
      description: "Track assignments, deadlines, and projects with priorities, due dates, and completion tracking.",
    },
    {
      icon: Zap,
      title: "Quick Capture",
      description: "Instantly jot down ideas during lectures or study sessions and organize them later.",
    },
    {
      icon: Calendar,
      title: "Calendar Sync",
      description: "Visualize all your tasks and deadlines in a unified calendar view to stay ahead of your schedule.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share notes and collaborate with classmates on group projects and study sessions.",
    },
    {
      icon: Search,
      title: "Search Everything",
      description: "Find any note, task, or idea instantly with powerful search and smart filtering.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      school: "MIT, Computer Science",
      quote: "Marlin transformed how I organize my coursework. I went from scattered notes everywhere to having everything in one place. My GPA improved by 0.5 points!",
    },
    {
      name: "Marcus Johnson",
      school: "Stanford, Engineering",
      quote: "The calendar view is a game-changer for managing multiple projects. I never miss a deadline anymore and can actually plan my study time effectively.",
    },
    {
      name: "Emma Rodriguez",
      school: "Harvard, Biology",
      quote: "Writing my thesis was overwhelming until I found Marlin. The folder system and tags made organizing research so much easier. Couldn't have done it without this tool.",
    },
    {
      name: "David Park",
      school: "UC Berkeley, Business",
      quote: "Our study group uses Marlin to share notes and track group project tasks. It's like having a personal assistant for all our academic work.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up Free",
      description: "Create your account in seconds with Google, GitHub, or email.",
    },
    {
      number: 2,
      title: "Organize Your Work",
      description: "Create folders, take notes, and add all your tasks and deadlines.",
    },
    {
      number: 3,
      title: "Stay on Track",
      description: "Use the dashboard and calendar to manage your time effectively.",
    },
    {
      number: 4,
      title: "Achieve More",
      description: "Focus on learning, not organizing. Let Marlin handle the rest.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-semibold">Marlin</span>
          </div>
          <Button asChild data-testid="button-login-header">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section - UPDATED */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Changed this div to have a solid black background */}
        <div className="absolute inset-0 bg-black">
          {/* Removed the <img> tag */}
          
          {/* Kept the overlay, but simplified since the background is already black */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" /> */}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Your Academic Life,<br />Beautifully Organized
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take notes, manage tasks, and stay on top of deadlines. Marlin helps students focus on what matters most—learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              variant="default"
              className="text-lg px-8 py-6 h-auto"
              asChild
              data-testid="button-get-started"
            >
              <a href="/api/login">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              asChild
              data-testid="button-learn-more"
            >
              <a href="#features">Learn More</a>
            </Button>
          </div>

          <p className="text-white/80 text-sm">
            Join 10,000+ students staying organized
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for students to manage their academic workload efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover-elevate transition-all duration-200">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">How Marlin Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your academic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <Card className="p-6 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </Card>
                {step.number < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">Loved by Students Everywhere</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how Marlin is helping students achieve their academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already using Marlin to excel in their studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 h-auto"
              asChild
              data-testid="button-get-started-cta"
            >
              <a href="/api/login">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80">
            Free for all students. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-semibold">Marlin</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your academic life, beautifully organized.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Study Tips</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Marlin. Built for students, by students.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-muted px-3 py-1 rounded-full">Privacy-focused</span>
              <span className="text-xs bg-muted px-3 py-1 rounded-full">Student-built</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}