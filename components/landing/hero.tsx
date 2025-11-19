import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Forms that people{" "}
            <span className="text-primary">actually enjoy</span> answering
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Build beautiful, conversational forms with advanced logic and custom
            branding. No coding required.
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
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-16">
          <div className="rounded-2xl border border-border bg-card backdrop-blur-xl p-4 shadow-2xl">
            <div className="w-full rounded-lg overflow-hidden">
              <Image
                src="/assets/banner.png"
                alt="Form Builder Interface"
                width={1200}
                height={700}
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
