import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2, 'Nom trop court').max(60),
  rating: z.coerce.number().int().min(1, 'Choisissez une note').max(5),
  comment: z.string().max(500).optional().or(z.literal(''))
});

export type ReviewInput = z.infer<typeof reviewSchema>;
