import DotGrid from "@/components/dot-grid";
import LandingNavbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import FeaturesSection from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import TemplatesSection from "@/components/landing/templates";
import CTALanding from "@/components/landing/cta";
import LandingFooter from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 z-0 ">
        <DotGrid
          dotSize={4}
          gap={40}
          baseColor="#1e293b"
          activeColor="#6366f1"
          proximity={180}
          speedTrigger={120}
          shockRadius={200}
          shockStrength={8}
          className="opacity-40"
        />
      </div>

      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <TemplatesSection />
        <CTALanding />
        <LandingFooter />
      </div>
    </div>
  );
}
