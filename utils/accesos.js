import { readFileSync, writeFileSync } from 'fs';
  import { join, dirname } from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const RUTA_ACCESOS = join(__dirname, '..', 'accesos.json');

  export function obtenerAccesos() {
    try {
      const datos = readFileSync(RUTA_ACCESOS, 'utf-8');
      return JSON.parse(datos);
    } catch {
      return {};
    }
  }

  export function guardarAccesos(accesos) {
    writeFileSync(RUTA_ACCESOS, JSON.stringify(accesos, null, 2), 'utf-8');
  }

  export function tieneAcceso(usuarioId, nombreComando, ownerId) {
    if (usuarioId === ownerId) return true;
    const accesos = obtenerAccesos();
    const comandosDeUsuario = accesos[usuarioId] || [];
    return comandosDeUsuario.includes('*') || comandosDeUsuario.includes(nombreComando);
  }

  export function otorgarAcceso(usuarioId, nombreComando) {
    const accesos = obtenerAccesos();
    if (!accesos[usuarioId]) accesos[usuarioId] = [];
    if (!accesos[usuarioId].includes(nombreComando)) {
      accesos[usuarioId].push(nombreComando);
      guardarAccesos(accesos);
      return true;
    }
    return false;
  }

  export function revocarAcceso(usuarioId, nombreComando) {
    const accesos = obtenerAccesos();
    if (!accesos[usuarioId]) return false;
    const idx = accesos[usuarioId].indexOf(nombreComando);
    if (idx === -1) return false;
    accesos[usuarioId].splice(idx, 1);
    if (accesos[usuarioId].length === 0) delete accesos[usuarioId];
    guardarAccesos(accesos);
    return true;
  }
  