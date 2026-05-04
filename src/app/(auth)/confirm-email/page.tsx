import ConfirmEmailView from "./ConfirmEmailView";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  return <ConfirmEmailView token={token} />;
}
