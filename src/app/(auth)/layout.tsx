import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NamibraPay — Account",
  description: "Sign in or create your NamibraPay account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-brand-navy overflow-hidden">
      {/* Decorative background blobs matching brand language */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-brand-pink/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-brand-lavender/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-brand-mint/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
