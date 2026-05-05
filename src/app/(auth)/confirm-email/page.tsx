import { Suspense } from "react";
import ConfirmEmailView from "./ConfirmEmailView";

export default function ConfirmEmailPage() {
  return (
    <Suspense>
      <ConfirmEmailView />
    </Suspense>
  );
}
