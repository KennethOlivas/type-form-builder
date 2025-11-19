import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Palette, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why teams choose FormFlow</h2>
          <p className="text-xl text-muted-foreground">
            Powerful features that make forms feel human
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
                <div className="w-full">
                  <Image
                    src="/smooth-scrolling-form-animation.jpg"
                    alt="Conversational form"
                    width={800}
                    height={400}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-xl font-bold mb-2">Conditional Logic</h3>
              <p className="text-muted-foreground mb-4">
                Ask smarter questions. Your form adapts: if they say NO, skip to
                Question 5. Build intelligent flows.
              </p>
              <div className="rounded-lg border border-border p-4 bg-muted/30">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>IF answer = &quot;Yes&quot;</span>
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
  );
}
