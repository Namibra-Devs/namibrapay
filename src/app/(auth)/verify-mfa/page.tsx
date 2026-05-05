import { Suspense } from "react";
import VerifyMFAView from "./VerifyMFAView";

export default function VerifyMFAPage() {
  return (
    <Suspense>
      <VerifyMFAView />
    </Suspense>
  );
}
