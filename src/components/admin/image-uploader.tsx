'use client';

import * as React from 'react';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCloudinarySignatureAction } from '@/actions/admin.actions';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo - regle de securite #24 : limiter la taille des uploads

export function ImageUploader({
  urls,
  onChange,
  folder = 'products',
  max = 6
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  max?: number;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [manualUrl, setManualUrl] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError(`"${file.name}" depasse 5 Mo.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError(`"${file.name}" n'est pas une image.`);
      return;
    }

    setUploading(true);
    try {
      const signed = await getCloudinarySignatureAction(folder);
      if (!signed.ok) {
        setError(signed.error);
        return;
      }

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signed.apiKey);
      form.append('timestamp', String(signed.timestamp));
      form.append('signature', signed.signature);
      form.append('folder', signed.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.error?.message ?? 'Echec de l\'upload Cloudinary.');
      }

      const data = (await response.json()) as { secure_url: string };
      onChange([...urls, data.secure_url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload impossible.');
    } finally {
      setUploading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = max - urls.length;
    const list = Array.from(files).slice(0, remaining);
    for (const file of list) {
      // Uploads sequentiels : simple, et evite de multiplier les appels de
      // signature en parallele pour une action rarement volumineuse.
      // eslint-disable-next-line no-await-in-loop
      await uploadFile(file);
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  function addManualUrl() {
    const trimmed = manualUrl.trim();
    if (!trimmed || urls.length >= max) return;
    onChange([...urls, trimmed]);
    setManualUrl('');
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div>
      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <div key={url + index} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image src={url} alt="" fill className="object-contain p-1" unoptimized />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Retirer cette image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {urls.length < max && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload-input"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Envoi...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden /> Choisir des images
              </>
            )}
          </Button>
          <span className="text-xs text-slate-400">ou collez une URL :</span>
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://..."
            className="h-9 max-w-xs text-xs"
          />
          <Button type="button" variant="ghost" size="sm" onClick={addManualUrl}>
            Ajouter
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-slate-400">
        JPG/PNG/WebP, 5 Mo max par image, {max - urls.length} restante(s).
      </p>
    </div>
  );
}
