import { readFileSync, writeFileSync, existsSync } from 'fs';
  import { join, dirname } from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const RUTA = join(__dirname, '..', 'settings.json');

  const DEFAULT = { status: null, prefixes: {} };

  function cargar() {
    if (!existsSync(RUTA)) return { ...DEFAULT };
    try {
      return JSON.parse(readFileSync(RUTA, 'utf-8'));
    } catch {
      return { ...DEFAULT };
    }
  }

  function guardar(data) {
    writeFileSync(RUTA, JSON.stringify(data, null, 2), 'utf-8');
  }

  export function getPrefix(guildId) {
    const s = cargar();
    return s.prefixes?.[guildId] || '!';
  }

  export function setPrefix(guildId, prefix) {
    const s = cargar();
    if (!s.prefixes) s.prefixes = {};
    s.prefixes[guildId] = prefix;
    guardar(s);
  }

  export function getStatus() {
    return cargar().status || null;
  }

  export function setStatus(type, text, state) {
    const s = cargar();
    s.status = { type, text, state };
    guardar(s);
  }

  export function clearStatus() {
    const s = cargar();
    s.status = null;
    guardar(s);
  }
  