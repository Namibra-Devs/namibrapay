import Link from "next/link";
import Logo from "@/components/ui/logo";

const solutions = [
  { label: "Payment Gateway", href: "#" },
  { label: "Developer Tools", href: "#" },
  { label: "Merchant Dashboard", href: "#" },
  { label: "Payouts", href: "#" },
];

const company = [
  { label: "About Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Status", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f9fafb] border-t border-gray-100 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-gray-200">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-55">
              Switching how businesses across Africa transact with money through
              technology that enables solutions.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-[10px] uppercase tracking-widest text-gray-400 mb-5">
              Solutions
            </h4>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-navy transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-[10px] uppercase tracking-widest text-gray-400 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-brand-navy transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © 2026 NamibraPay. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
