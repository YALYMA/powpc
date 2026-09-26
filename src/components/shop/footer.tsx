import Link from 'next/link';
import { BatteryCharging, Mail, Phone } from 'lucide-react';
import { CONTACT, SITE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BatteryCharging className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-semibold text-slate-900">PowerPC</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{SITE.slogan}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Catalogue</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/batteries" className="hover:text-brand-600">Batteries PC</Link></li>
            <li><Link href="/chargeurs" className="hover:text-brand-600">Chargeurs PC</Link></li>
            <li><Link href="/compatibilite" className="hover:text-brand-600">Verifier la compatibilite</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Aide</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/a-propos" className="hover:text-brand-600">A propos</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact</Link></li>
            <li><Link href="/demande-disponibilite" className="hover:text-brand-600">Demande de disponibilite</Link></li>
            <li><Link href="/suivi-commande" className="hover:text-brand-600">Suivre ma commande</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" aria-hidden /> {CONTACT.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden /> {CONTACT.email}
            </li>
            <li className="text-slate-500">Livraison Dakar et regions</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} PowerPC. Tous droits reserves.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/mentions-legales" className="hover:text-brand-600">Mentions legales</Link>
          <Link href="/conditions-generales" className="hover:text-brand-600">CGV</Link>
          <Link href="/confidentialite" className="hover:text-brand-600">Confidentialite</Link>
        </div>
      </div>
    </footer>
  );
}
