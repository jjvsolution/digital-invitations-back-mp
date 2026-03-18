-- Inserta los templates desde `prisma/seed.ts` directamente en Postgres.
-- Equivalencia con Prisma:
-- - Prisma hace `upsert` por `name` con `update: {}` -> aquí usamos `ON CONFLICT ("name") DO NOTHING`.
-- - Prisma genera `id` con `@default(uuid())` -> aquí usamos `gen_random_uuid()`.

BEGIN;

-- Necesario para `gen_random_uuid()` en la mayoría de setups.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "Template" ("id", "name", "eventType", "previewImageUrl", "defaultSettings", "defaultSections")
VALUES
  (
    gen_random_uuid(),
    'Bautizo',
    'BAUTIZO'::"EventType",
    NULL,
    '{
      "colors": {"primary":"#2D6CDF","background":"#F7FAFF","text":"#0F172A"},
      "font": {"heading":"Poppins","body":"Inter"},
      "radius":16
    }'::jsonb,
    '{
      "countdown":true,
      "location":true,
      "gallery":true,
      "schedule":true,
      "music":false,
      "gifts":true,
      "rsvp":true
    }'::jsonb
  )
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Template" ("id", "name", "eventType", "previewImageUrl", "defaultSettings", "defaultSections")
VALUES
  (
    gen_random_uuid(),
    'Cumpleaños',
    'CUMPLEANOS'::"EventType",
    NULL,
    '{
      "colors": {"primary":"#FF3D71","background":"#FFF5F8","text":"#111827"},
      "font": {"heading":"Montserrat","body":"Inter"},
      "radius":20
    }'::jsonb,
    '{
      "countdown":true,
      "location":true,
      "gallery":true,
      "schedule":true,
      "music":true,
      "gifts":false,
      "rsvp":true
    }'::jsonb
  )
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Template" ("id", "name", "eventType", "previewImageUrl", "defaultSettings", "defaultSections")
VALUES
  (
    gen_random_uuid(),
    'Matrimonio Elegante',
    'MATRIMONIO'::"EventType",
    NULL,
    '{
      "colors": {"primary":"#CFAE70","background":"#FAF7F2","text":"#1F2937"},
      "font": {"heading":"Playfair Display","body":"Inter"},
      "radius":18
    }'::jsonb,
    '{
      "countdown":true,
      "location":true,
      "gallery":true,
      "schedule":true,
      "music":true,
      "gifts":true,
      "rsvp":true
    }'::jsonb
  )
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Template" ("id", "name", "eventType", "previewImageUrl", "defaultSettings", "defaultSections")
VALUES
  (
    gen_random_uuid(),
    'Baby Shower',
    'BABY_SHOWER'::"EventType",
    NULL,
    '{
      "colors": {"primary":"#7C3AED","background":"#F7F2FF","text":"#111827"},
      "font": {"heading":"Nunito","body":"Inter"},
      "radius":20
    }'::jsonb,
    '{
      "countdown":true,
      "location":true,
      "gallery":true,
      "schedule":true,
      "music":false,
      "gifts":true,
      "rsvp":true
    }'::jsonb
  )
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Template" ("id", "name", "eventType", "previewImageUrl", "defaultSettings", "defaultSections")
VALUES
  (
    gen_random_uuid(),
    'Fiesta',
    'FIESTA'::"EventType",
    NULL,
    '{
      "colors": {"primary":"#111827","background":"#F9FAFB","text":"#111827"},
      "font": {"heading":"Inter","body":"Inter"},
      "radius":14
    }'::jsonb,
    '{
      "countdown":true,
      "location":true,
      "gallery":true,
      "schedule":true,
      "music":true,
      "gifts":false,
      "rsvp":true
    }'::jsonb
  )
ON CONFLICT ("name") DO NOTHING;

COMMIT;

