'use client';

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a' }}>
            Une erreur inattendue est survenue
          </h1>
          <p style={{ marginTop: '8px', color: '#475569', fontSize: '14px', maxWidth: '400px' }}>
            L'equipe PowerPC a ete informee. Vous pouvez reessayer ou revenir a l'accueil.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => reset()}
              style={{ height: '40px', padding: '0 20px', borderRadius: '10px', background: '#4f46e5', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              Reessayer
            </button>
            <a
              href="/"
              style={{ height: '40px', display: 'inline-flex', alignItems: 'center', padding: '0 20px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', textDecoration: 'none' }}
            >
              Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
