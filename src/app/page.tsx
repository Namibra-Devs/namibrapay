import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import Features from "@/components/sections/Features";
import UseCases from "@/components/sections/UseCases";
import CTA from "@/components/sections/CTA";

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
