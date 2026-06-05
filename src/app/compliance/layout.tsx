import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Dashboard | NamibraPay",
  description: "NamibraPay Compliance Officer Dashboard",
};

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
