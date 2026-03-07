import { Suspense } from "react";
import { redirect } from "next/navigation";
import ResetPinPageWrapper from "@/components/ResetPinPageWrapper";

interface ResetPinPageProps {
  searchParams: Promise<{ token?: string }>;
}

export const metadata = {
  title: "Reset Your PIN | GbanaMarket",
  description: "Reset your seller PIN to regain access to your listings",
};

export default async function ResetPinPageRoute({ searchParams }: ResetPinPageProps) {
  const params = await searchParams;
  const token = params?.token;

  if (!token) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ResetPinPageWrapper token={token} />
    </Suspense>
  );
}
