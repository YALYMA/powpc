export async function register() {
  // Le hook tourne aussi bien pour le runtime nodejs que pour le middleware
  // (edge) : on ne valide l'environnement complet que cote nodejs, la ou
  // toutes les variables serveur sont accessibles.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./lib/env');
    validateEnv();
  }
}
