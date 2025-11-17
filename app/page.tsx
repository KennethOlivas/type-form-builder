"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Palette,
  FileText,
  Calendar,
  MessageSquare,
  Briefcase,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Animated dot grid background */}
      <div className="fixed inset-0 z-0"></div>

      {/* Content with z-index and relative positioning */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold">
                  FormFlow
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Product
                  </Link>
                  <Link
                    href="#templates"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Templates
                  </Link>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  asChild
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
                Forms that people{" "}
                <span className="text-primary">actually enjoy</span> answering
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                Build beautiful, conversational forms with advanced logic and
                custom branding. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8"
                >
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 px-8"
                >
                  <Link href="#demo">Watch Demo</Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mt-16">
              <div className="rounded-2xl border border-border bg-card backdrop-blur-xl p-4 shadow-2xl">
                <img
                  src="/form-builder-interface-with-conversational-design.jpg"
                  alt="Form Builder Interface"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <p className="text-center text-muted-foreground mb-8">
              Trusted by innovative teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
              <div className="text-2xl font-bold">COMPANY</div>
              <div className="text-2xl font-bold">BRAND</div>
              <div className="text-2xl font-bold">STARTUP</div>
              <div className="text-2xl font-bold">TEAM</div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-3xl font-bold text-primary">
                Increase completion rates by up to 40%
              </p>
              <p className="text-muted-foreground mt-2">
                with our one-question-at-a-time format
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Why teams choose FormFlow
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features that make forms feel human
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-border bg-card backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Conversational Experience
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    One question at a time. Focus your users and improve data
                    quality with smooth, engaging transitions.
                  </p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <img
                      src="/smooth-scrolling-form-animation.jpg"
                      alt="Conversational form"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-border bg-card backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Conditional Logic</h3>
                  <p className="text-muted-foreground mb-4">
                    Ask smarter questions. Your form adapts: if they say NO,
                    skip to Question 5. Build intelligent flows.
                  </p>
                  <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>IF answer = "Yes"</span>
                    </div>
                    <div className="ml-3 border-l-2 border-border pl-3 py-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>GOTO Question 5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-border bg-card backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-chart-5/20 flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-chart-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
                  <p className="text-muted-foreground mb-4">
                    Your brand, your style. Add custom welcome screens, logos,
                    colors, and even video backgrounds.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded bg-primary" />
                    <div className="h-12 rounded bg-chart-2" />
                    <div className="h-12 rounded bg-chart-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How it works</h2>
              <p className="text-xl text-muted-foreground">
                Get started in minutes, not hours
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Build</h3>
                <p className="text-muted-foreground">
                  Drag and drop your questions. Choose from 10+ question types.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Customize</h3>
                <p className="text-muted-foreground">
                  Add your logic and brand design. Make it uniquely yours.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Share</h3>
                <p className="text-muted-foreground">
                  Get a link and share it anywhere. Track responses in
                  real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases / Templates */}
        <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Built for every use case
              </h2>
              <p className="text-xl text-muted-foreground">
                Start with a template or build from scratch
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border bg-card backdrop-blur-xl hover:bg-accent transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-chart-1/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6 text-chart-1" />
                  </div>
                  <h3 className="font-bold mb-2">Customer Satisfaction</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure and improve customer experience
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card backdrop-blur-xl hover:bg-accent transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-bold mb-2">Event Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect RSVPs and attendee information
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card backdrop-blur-xl hover:bg-accent transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-chart-2" />
                  </div>
                  <h3 className="font-bold mb-2">Product Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Gather insights from your users
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card backdrop-blur-xl hover:bg-accent transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-orange-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold mb-2">Job Applications</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamline your hiring process
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/20 to-chart-2/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to create better forms?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams using FormFlow to collect better data
            </p>
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg"
            >
              <Link href="/signup">
                Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4">FormFlow</h3>
                <p className="text-muted-foreground text-sm">
                  Beautiful, conversational forms that people love to fill out.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#features"
                      className="hover:text-foreground transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#templates"
                      className="hover:text-foreground transition-colors"
                    >
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      GitHub
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      LinkedIn
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 FormFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
