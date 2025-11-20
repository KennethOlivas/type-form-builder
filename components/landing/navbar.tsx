import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/10 backdrop-blur-xl bg-white/70 dark:bg-black/70 supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight text-black dark:text-white">
              FormFlow
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="#features"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Product
              </Link>
              <Link
                href="#templates"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Templates
              </Link>
              <Link
                href="#pricing"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
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
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 h-8 px-3 text-sm"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-8 px-4 rounded-full text-sm font-medium transition-all"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
