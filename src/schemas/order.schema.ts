import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20)
});

export const orderSchema = z.object({
  firstName: z.string().min(2, 'Prenom requis').max(60),
  lastName: z.string().min(2, 'Nom requis').max(60),
  phone: z.string().min(9, 'Telephone invalide').max(20),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  city: z.string().min(2, 'Ville requise').max(60),
  district: z.string().min(2, 'Quartier requis').max(80),
  addressDetails: z.string().max(300).optional().or(z.literal('')),
  deliveryMethod: z.enum(['LIVRAISON', 'RETRAIT']),
  paymentMethod: z.enum(['PAIEMENT_LIVRAISON', 'WHATSAPP']),
  note: z.string().max(500).optional().or(z.literal('')),
  items: z.array(cartItemSchema).min(1, 'Votre panier est vide').max(30)
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    'EN_ATTENTE',
    'CONFIRMEE',
    'EN_PREPARATION',
    'EXPEDIEE',
    'LIVREE',
    'ANNULEE'
  ])
});

export type OrderInput = z.infer<typeof orderSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
