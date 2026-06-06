import Navbar from "@/components/landing-page/layout/Navbar";
import Footer from "@/components/landing-page/layout/Footer";
import Hero from "@/components/landing-page/sections/Hero";
import Partners from "@/components/landing-page/sections/Partners";
import Features from "@/components/landing-page/sections/Features";
import UseCases from "@/components/landing-page/sections/UseCases";
import CTA from "@/components/landing-page/sections/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Partners />
        <Features />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
