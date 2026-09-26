import { getClients } from '@/services/customer.service';
import { toggleClientActiveAction } from '@/actions/admin.actions';
import { ClientRowActions } from '@/components/admin/simple-forms';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const clients = await getClients(q);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Clients</h1>

      <form className="mt-5" action="/admin/clients">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom, email ou telephone..."
          className="h-10 w-full max-w-sm rounded-xl border border-slate-300 px-3 text-sm focus:border-brand-500 focus:outline-none"
        />
      </form>

      <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Demandes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Aucun client.
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client.id} className={client.isActive ? '' : 'opacity-50'}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {client.firstName} {client.lastName}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{client.email}</p>
                  <p className="text-xs text-slate-500">{client.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-3">{client._count.orders}</td>
                <td className="px-4 py-3">{client._count.requests}</td>
                <td className="px-4 py-3">
                  <ClientRowActions
                    id={client.id}
                    isActive={client.isActive}
                    onToggle={toggleClientActiveAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 md:hidden">
        {clients.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Aucun client.
          </p>
        )}
        {clients.map((client) => (
          <div
            key={client.id}
            className={`rounded-2xl border border-slate-200 bg-white p-4 ${client.isActive ? '' : 'opacity-50'}`}
          >
            <p className="font-medium text-slate-900">
              {client.firstName} {client.lastName}
            </p>
            <p className="text-sm text-slate-600">{client.email}</p>
            <p className="text-xs text-slate-500">{client.phone}</p>
            <dl className="mt-3 grid grid-cols-3 gap-y-1.5 text-sm">
              <dt className="text-slate-500">Inscrit</dt>
              <dd className="col-span-2 text-right text-slate-700">{formatDate(client.createdAt)}</dd>
              <dt className="text-slate-500">Commandes</dt>
              <dd className="col-span-2 text-right text-slate-700">{client._count.orders}</dd>
              <dt className="text-slate-500">Demandes</dt>
              <dd className="col-span-2 text-right text-slate-700">{client._count.requests}</dd>
            </dl>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <ClientRowActions
                id={client.id}
                isActive={client.isActive}
                onToggle={toggleClientActiveAction}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
