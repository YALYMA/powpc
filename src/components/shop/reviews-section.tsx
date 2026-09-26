'use client';

import * as React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea, FieldError } from '@/components/ui/input';
import { StarRatingDisplay, StarRatingInput } from './star-rating';
import { createReviewAction } from '@/actions/review.actions';
import { formatDate } from '@/lib/utils';

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
};

export function ReviewsSection({
  productId,
  average,
  count,
  reviews
}: {
  productId: string;
  average: number | null;
  count: number;
  reviews: Review[];
}) {
  const [showForm, setShowForm] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (rating === 0) {
      setError('Choisissez une note avant d\'envoyer votre avis.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      productId,
      customerName: form.get('customerName'),
      rating,
      comment: form.get('comment') ?? ''
    };

    startTransition(async () => {
      const result = await createReviewAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if ('fieldErrors' in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors as Record<string, string[]>);
        }
        return;
      }
      setSubmitted(true);
      setShowForm(false);
      setRating(0);
    });
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Avis clients</h2>
          {count > 0 && average !== null ? (
            <div className="mt-1 flex items-center gap-2">
              <StarRatingDisplay average={average} size="md" />
              <span className="text-sm text-slate-600">
                {average.toFixed(1)} sur 5 · {count} avis
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Aucun avis pour le moment.</p>
          )}
        </div>

        {!showForm && !submitted && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <MessageSquarePlus className="h-4 w-4" aria-hidden /> Laisser un avis
          </Button>
        )}
      </div>

      {submitted && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Merci, votre avis a ete publie.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
          <div>
            <Label>Votre note</Label>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
          <div>
            <Label htmlFor="customerName">Votre nom</Label>
            <Input id="customerName" name="customerName" required />
            <FieldError message={fieldErrors.customerName?.[0]} />
          </div>
          <div>
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea id="comment" name="comment" rows={3} placeholder="Votre experience avec ce produit..." />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Envoi...' : 'Publier mon avis'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </form>
      )}

      {reviews.length > 0 && (
        <ul className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">{review.customerName}</p>
                <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
              </div>
              <div className="mt-1">
                <StarRatingDisplay average={review.rating} />
              </div>
              {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
