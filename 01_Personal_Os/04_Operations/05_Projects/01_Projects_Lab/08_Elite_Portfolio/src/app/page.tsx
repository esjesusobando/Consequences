import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { ProjectsGrid } from "@/components/projects-grid";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <Navigation />
      <Hero name="Sofía Mayen" role="Product Designer & Creative Director" tagline="Crafting experiences that feel inevitable." />
      <ProjectsGrid />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
