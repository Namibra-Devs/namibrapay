import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="NamibraPay"
        width={125}
        height={36}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
