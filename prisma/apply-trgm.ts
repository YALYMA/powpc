import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

/**
 * Applique prisma/pg-trgm.sql via Prisma plutot que via psql, pour ne pas
 * dependre d'un client PostgreSQL installe sur la machine de deploiement.
 * Idempotent : chaque instruction utilise IF NOT EXISTS.
 */
async function main() {
  const prisma = new PrismaClient();
  const sqlPath = join(__dirname, 'pg-trgm.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    console.log(`Execution : ${statement.slice(0, 70)}...`);
    await prisma.$executeRawUnsafe(statement);
  }

  console.log('Index de recherche pg_trgm en place.');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(
    "Echec de l'application des index pg_trgm. Verifiez que votre base autorise CREATE EXTENSION " +
      '(certains hebergeurs geres restreignent ce droit — Neon et Supabase l\'autorisent par defaut).'
  );
  console.error(error);
  process.exit(1);
});
