"use client";
import Reveal from "@/components/landing/reveal";
import Link from "next/link";
import { Github, Twitter, Linkedin, Code2 } from "lucide-react";

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
              <div className="flex space-x-4 mb-4">
                <Link href="#" className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://github.com/KennethOlivas" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
              <Link 
                href="https://github.com/KennethOlivas/type-form-builder" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <Code2 className="h-4 w-4" />
                <span>View Project</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8 text-center text-sm text-zinc-600 dark:text-zinc-600">
            <p>&copy; {new Date().getFullYear()} FormFlow. Created by <a href="https://github.com/KennethOlivas" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors font-medium">Kenneth Olivas</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Reveal>
  );
}
