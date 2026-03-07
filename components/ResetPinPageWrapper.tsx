"use client";

import ResetPinPage from "./ResetPinPage";

interface ResetPinPageWrapperProps {
  token: string;
}

export default function ResetPinPageWrapper({ token }: ResetPinPageWrapperProps) {
  return <ResetPinPage resetToken={token} />;
}
