import LandingNavbar from "@/components/landing/navbar";
import StickyNav from "@/components/landing/sticky-nav";
import HeroSection from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import FeaturesSection from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import TemplatesSection from "@/components/landing/templates";
import CTALanding from "@/components/landing/cta";
import LandingFooter from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30">
      <LandingNavbar />
      <StickyNav />
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
