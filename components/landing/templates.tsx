import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, FileText, Briefcase } from "lucide-react";

export default function TemplatesSection() {
  return (
    <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for every use case</h2>
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
  );
}
