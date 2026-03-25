"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "pwa_install_prompt_dismissed";

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hidden, setHidden] = useState(true);

  const canShow = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(DISMISS_KEY) !== "1";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !canShow) {
      return;
    }

    if (isStandaloneMode()) {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios|opr\//.test(ua);

    if (isIos && isSafari) {
      setShowIosHint(true);
      setHidden(false);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setShowIosHint(false);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [canShow]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  };

  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setHidden(true);
    }

    setDeferredPrompt(null);
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-slate-900">Install Succevia Hub</p>
        {deferredPrompt ? (
          <p className="mt-1 text-sm text-slate-600">
            Add this app to your phone for faster access and a full-screen experience.
          </p>
        ) : showIosHint ? (
          <p className="mt-1 text-sm text-slate-600">
            On iPhone: tap Share, then choose Add to Home Screen.
          </p>
        ) : null}
        <div className="mt-3 flex gap-2">
          {deferredPrompt ? (
            <button
              type="button"
              onClick={install}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Install
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
