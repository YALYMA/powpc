import { z } from 'zod';

export const availabilityRequestSchema = z.object({
  customerName: z.string().min(2, 'Nom requis').max(80),
  phone: z.string().min(9, 'Telephone invalide').max(20),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  brandName: z.string().min(2, 'Marque requise').max(60),
  laptopModel: z.string().min(2, 'Modele requis').max(80),
  type: z.enum(['BATTERIE', 'CHARGEUR', 'AUTRE']),
  knownRef: z.string().max(60).optional().or(z.literal('')),
  message: z.string().max(600).optional().or(z.literal('')),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal(''))
});

export const requestStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(['NOUVELLE', 'EN_COURS', 'TRAITEE', 'ANNULEE']),
  adminNote: z.string().max(500).optional().or(z.literal(''))
});

export type AvailabilityRequestInput = z.infer<typeof availabilityRequestSchema>;
