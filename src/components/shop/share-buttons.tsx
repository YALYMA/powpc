'use client';

import * as React from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = React.useState(false);
  const [canNativeShare, setCanNativeShare] = React.useState(false);

  React.useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && Boolean(navigator.share));
  }, []);

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // l'utilisateur a annule le partage : rien a faire
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible (contexte non securise) : on ignore silencieusement
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-500">Partager :</span>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Partager ce produit"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-emerald-600 hover:bg-emerald-50"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.3-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.17-.2.73-.85.93-1.14.2-.29.39-.24.65-.14.27.1 1.7.8 1.99.94.29.15.48.22.55.35.07.13.07.75-.17 1.43Z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copier le lien"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
      {copied && <span className="text-xs text-emerald-600">Lien copie</span>}
    </div>
  );
}
