-- A executer UNE FOIS, apres la premiere migration (npx prisma migrate dev --name init).
-- Active la recherche indexee pour les requetes ILIKE '%terme%' utilisees par
-- la barre de recherche et les filtres catalogue. Sans cet index, PostgreSQL
-- fait un scan sequentiel de la table Product a chaque recherche : rapide
-- avec 20 produits de demonstration, nettement plus lent au-dela de
-- quelques milliers de references.
--
-- Application :
--   npm run db:trgm
-- ou directement :
--   psql "$DATABASE_URL" -f prisma/pg-trgm.sql

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Product_name_trgm_idx" ON "Product" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_reference_trgm_idx" ON "Product" USING GIN (reference gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_description_trgm_idx" ON "Product" USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Brand_name_trgm_idx" ON "Brand" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Laptop_model_trgm_idx" ON "Laptop" USING GIN (model gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Laptop_series_trgm_idx" ON "Laptop" USING GIN (series gin_trgm_ops);
