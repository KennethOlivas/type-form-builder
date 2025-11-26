import LandingNavbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import FeaturesSection from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import TemplatesSection from "@/components/landing/templates";
import CTALanding from "@/components/landing/cta";
import LandingFooter from "@/components/landing/footer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Beautiful Forms | TypeForm Clone",
  description: "The best free alternative to Typeform. Create conversational forms, surveys, and quizzes in minutes.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-primary">
      <LandingNavbar />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <TemplatesSection />
        <CTALanding />
      </main>
      <LandingFooter />
    </div>
  );
}
