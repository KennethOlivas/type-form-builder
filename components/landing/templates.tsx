"use client";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, FileText, Briefcase } from "lucide-react";

export default function TemplatesSection() {
  return (
    <Reveal>
      <section id="templates" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-black dark:text-white">Built for every use case</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Start with a template or build from scratch</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-700">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Customer Satisfaction</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Measure and improve customer experience</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-700">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Event Registration</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Collect RSVPs and attendee information</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-700">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <FileText className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Product Feedback</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Gather insights from your users</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-700">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Job Applications</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Streamline your hiring process</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
