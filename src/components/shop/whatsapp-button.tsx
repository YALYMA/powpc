import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function WhatsappButton({
  message,
  label = 'Commander sur WhatsApp',
  className
}: {
  message: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700',
        className
      )}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
