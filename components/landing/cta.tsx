import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTALanding() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-primary/20 to-chart-2/20">
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
  );
}
