"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, ShieldCheck } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const APK_SHA256 =
  "7495429A802BD29A5C253552F2CAC526A241AD474A3F31B3666BD7D30A7D0A0D";

const GITHUB_RELEASES_URL = "https://github.com/ButtySaylee/gbana-market/releases/download/v1.0.0/SucceviaHub.apk";

export default function AndroidInstallOptions() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(ua));

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(APK_SHA256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Install Without Download</h2>
        <p className="mt-2 text-sm text-slate-600">
          Recommended for most users. This uses your browser install flow and updates automatically.
        </p>
        <div className="mt-4">
          {isStandalone ? (
            <p className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              <ShieldCheck className="h-4 w-4" />
              App is already installed on this device.
            </p>
          ) : deferredPrompt ? (
            <button
              type="button"
              onClick={triggerInstall}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Smartphone className="h-4 w-4" />
              Install App
            </button>
          ) : (
            <p className="text-sm text-slate-600">
              Open this site in Android Chrome, then tap the browser menu and choose Install app.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Download APK (Fallback)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use this only if browser install is unavailable. You may need to allow installs from this source.
        </p>

        {!isAndroid ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You are not on Android. APK files only work on Android devices.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2 text-sm font-semibold text-white hover:bg-[#001733]"
          >
            <Download className="h-4 w-4" />
            Download APK
          </a>
          <span className="text-xs text-slate-500">Size: 1.88 MB</span>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">SHA-256 checksum</p>
          <p className="mt-1 break-all font-mono text-[11px] text-slate-600">{APK_SHA256}</p>
          <button
            type="button"
            onClick={copyChecksum}
            className="mt-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            {copied ? "Copied" : "Copy checksum"}
          </button>
        </div>
      </div>
    </section>
  );
}
