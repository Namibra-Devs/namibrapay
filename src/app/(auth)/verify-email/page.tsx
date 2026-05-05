import { Suspense } from "react";
import VerifyEmailView from "./VerifyEmailView";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailView />
    </Suspense>
  );
}
