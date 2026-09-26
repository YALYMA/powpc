import type { Metadata } from 'next';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { WhatsappButton } from '@/components/shop/whatsapp-button';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez PowerPC par WhatsApp, telephone ou email. Assistance batteries et chargeurs PC au Senegal.'
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Nous contacter</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Une question sur la compatibilite, une commande en cours, un produit introuvable ? Le plus
        rapide reste WhatsApp.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {[
          { icon: Phone, label: 'Telephone', value: CONTACT.phone },
          { icon: Mail, label: 'Email', value: CONTACT.email },
          { icon: MapPin, label: 'Zone de livraison', value: 'Dakar, banlieue et regions' },
          { icon: Clock, label: 'Horaires', value: 'Lundi - Samedi, 9h - 19h' }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <item.icon className="h-5 w-5 text-brand-600" aria-hidden />
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-slate-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Ecrivez-nous sur WhatsApp</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          Envoyez-nous le modele de votre PC, ou une photo de l'etiquette de votre batterie.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsappButton
            label="Demarrer la conversation"
            message="Bonjour, j'ai une question concernant une batterie ou un chargeur."
          />
        </div>
      </div>
    </div>
  );
}
