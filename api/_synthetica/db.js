// Acceso a PostgreSQL (Neon en producción). En las pruebas se inyecta PGlite con usarBaseDePrueba().
import pg from 'pg';

let pool = null;
let prueba = null;
let listo = null;

export function usarBaseDePrueba(fn) { prueba = fn; listo = null; }

export async function query(texto, params = []) {
  if (prueba) return prueba(texto, params);
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL');
  pool ||= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false }
  });
  return pool.query(texto, params);
}

// El esquema se crea solo la primera vez (IF NOT EXISTS), sin migraciones manuales.
const ESQUEMA = [
  `create table if not exists usuarios (
     id text primary key,
     nombre text not null,
     correo text not null unique,
     clave_hash text not null,
     aceptaciones jsonb not null default '[]',
     creado timestamptz not null default now()
   )`,
  // Todo el estado de la plataforma de cada cuenta: proyectos, auditorías, borradores, correos.
  // «version» evita que dos pestañas o equipos se pisen (concurrencia optimista).
  `create table if not exists documentos (
     usuario_id text primary key references usuarios(id) on delete cascade,
     datos jsonb not null,
     version integer not null default 1,
     actualizado timestamptz not null default now()
   )`,
  // Evidencia legal de cada acuerdo de confidencialidad firmado al iniciar un proyecto.
  `create table if not exists consentimientos (
     id bigserial primary key,
     usuario_id text not null references usuarios(id) on delete cascade,
     proyecto_id text not null,
     documento text not null,
     version text not null,
     fecha timestamptz not null default now(),
     ip text,
     navegador text
   )`,
  // Enlaces para crear una contraseña nueva: se guarda solo el hash del token, vence en 1 hora y sirve una vez.
  `create table if not exists recuperaciones (
     token_hash text primary key,
     usuario_id text not null references usuarios(id) on delete cascade,
     vence timestamptz not null,
     usado boolean not null default false,
     creado timestamptz not null default now()
   )`,
  `create table if not exists correos_enviados (
     id bigserial primary key,
     usuario_id text not null references usuarios(id) on delete cascade,
     asunto text not null,
     enviado boolean not null,
     fecha timestamptz not null default now()
   )`,
  // Credenciales de los proyectos (QA visual): cifradas con AES-256-GCM (cifrado.js). Solo las descifra el equipo al bajar el proyecto.
  `create table if not exists credenciales (
     usuario_id text not null references usuarios(id) on delete cascade,
     proyecto_id text not null,
     cifrado text not null,
     actualizado timestamptz not null default now(),
     primary key (usuario_id, proyecto_id)
   )`,
  // Relé: lo que el cliente hace en una página del espejo de un motor, hasta que el vigilante lo aplica (INTEGRACION.md).
  `create table if not exists buzon (
     id bigserial primary key,
     usuario_id text not null references usuarios(id) on delete cascade,
     proyecto_id text not null,
     metodo text not null,
     ruta text not null,
     consulta text not null default '',
     tipo text not null default 'application/octet-stream',
     cuerpo text not null default '',
     estado text not null default 'pendiente',
     respuesta_estado integer,
     respuesta_tipo text,
     respuesta text,
     creado timestamptz not null default now(),
     hecho timestamptz
   )`,
  `create index if not exists buzon_pendiente on buzon (estado, id)`
];

export function esquema() {
  listo ||= (async () => { for (const s of ESQUEMA) await query(s); })().catch(e => { listo = null; throw e; });
  return listo;
}
