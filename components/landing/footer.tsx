"use client";
import Reveal from "@/components/landing/reveal";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <Reveal>
      <footer className="bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4 text-black dark:text-white">FormFlow</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Beautiful, conversational forms that people love to fill out.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-500">
                <li>
                  <Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="#templates" className="hover:text-black dark:hover:text-white transition-colors">Templates</Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-500">
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Connect</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-500">
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">GitHub</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8 text-center text-sm text-zinc-600 dark:text-zinc-600">
            <p>&copy; 2025 FormFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Reveal>
  );
}
