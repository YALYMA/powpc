import { getRequests } from '@/services/availability.service';
import { RequestStatusSelect } from '@/components/admin/request-status-select';
import { whatsappLink } from '@/lib/whatsapp';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  const requests = await getRequests();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Demandes de disponibilite</h1>

      <div className="mt-6 space-y-4">
        {requests.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Aucune demande.
          </p>
        )}

        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">
                  {request.brandName} {request.laptopModel}
                </p>
                <p className="text-sm text-slate-600">
                  {request.customerName} · {request.phone}
                  {request.knownRef ? ` · Ref : ${request.knownRef}` : ''}
                </p>
                <p className="text-xs text-slate-500">
                  {request.type} · {formatDate(request.createdAt)}
                  {request.laptopId ? ' · modele reconnu' : ' · modele inconnu au catalogue'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={whatsappLink(
                    `Bonjour ${request.customerName}, concernant votre demande pour ${request.brandName} ${request.laptopModel} :`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Repondre
                </a>
                <RequestStatusSelect requestId={request.id} status={request.status} />
              </div>
            </div>

            {request.message && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
                {request.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
