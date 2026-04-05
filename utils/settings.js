import { readFileSync, writeFileSync, existsSync } from 'fs';
  import { join, dirname } from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const RUTA = join(__dirname, '..', 'settings.json');

  const DEFAULT = { status: null, prefixes: {}, logKeyChannels: {}, logTicketChannels: {}, ticketCounters: {} };

  function cargar() {
    if (!existsSync(RUTA)) return { ...DEFAULT };
    try { return JSON.parse(readFileSync(RUTA, 'utf-8')); }
    catch { return { ...DEFAULT }; }
  }

  function guardar(data) { writeFileSync(RUTA, JSON.stringify(data, null, 2), 'utf-8'); }

  export function getPrefix(guildId) { return cargar().prefixes?.[guildId] || '!'; }
  export function setPrefix(guildId, prefix) {
    const s = cargar(); if (!s.prefixes) s.prefixes = {};
    s.prefixes[guildId] = prefix; guardar(s);
  }

  export function getStatus() { return cargar().status || null; }
  export function setStatus(type, text, state) {
    const s = cargar(); s.status = { type, text, state }; guardar(s);
  }
  export function clearStatus() { const s = cargar(); s.status = null; guardar(s); }

  export function getLogKeyChannel(guildId) { return cargar().logKeyChannels?.[guildId] || null; }
  export function setLogKeyChannel(guildId, channelId) {
    const s = cargar(); if (!s.logKeyChannels) s.logKeyChannels = {};
    if (channelId === null) delete s.logKeyChannels[guildId];
    else s.logKeyChannels[guildId] = channelId;
    guardar(s);
  }

  export function getLogTicketChannel(guildId) { return cargar().logTicketChannels?.[guildId] || null; }
  export function setLogTicketChannel(guildId, channelId) {
    const s = cargar(); if (!s.logTicketChannels) s.logTicketChannels = {};
    if (channelId === null) delete s.logTicketChannels[guildId];
    else s.logTicketChannels[guildId] = channelId;
    guardar(s);
  }

  export function getNextTicketNumber(guildId) {
    const s = cargar(); if (!s.ticketCounters) s.ticketCounters = {};
    const next = (s.ticketCounters[guildId] || 0) + 1;
    s.ticketCounters[guildId] = next; guardar(s);
    return String(next).padStart(4, '0');
  }
  