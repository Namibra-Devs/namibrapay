import { Suspense } from "react";
import ResetPasswordView from "./ResetPasswordView";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}
