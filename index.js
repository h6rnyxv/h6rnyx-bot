import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
  import { readdirSync } from 'fs';
  import { join, dirname } from 'path';
  import { fileURLToPath, pathToFileURL } from 'url';

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const REQUIRED_VARS = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
  for (const v of REQUIRED_VARS) {
    if (!process.env[v]) {
      console.error(`[ERROR] Falta variable de entorno: ${v}`);
      process.exit(1);
    }
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
  });

  client.commands = new Collection();
  client.prefixCommands = new Collection();
  client.prefix = process.env.BOT_PREFIX || '!';
  client.ownerId = process.env.DISCORD_OWNER_ID || '';

  async function cargarSlashCommands() {
    const ruta = join(__dirname, 'commands');
    const archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));
    for (const archivo of archivos) {
      const mod = await import(pathToFileURL(join(ruta, archivo)).href);
      const cmd = mod.default;
      if (!cmd?.data?.name) continue;
      client.commands.set(cmd.data.name, cmd);
      console.log(`[SLASH] Cargado: /${cmd.data.name}`);
    }
  }

  async function cargarPrefixCommands() {
    const carpetas = ['general', 'moderacion', 'diversion', 'owner', 'server', 'utilidad'];
    for (const carpeta of carpetas) {
      const ruta = join(__dirname, 'prefix', carpeta);
      let archivos;
      try {
        archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));
      } catch { continue; }

      for (const archivo of archivos) {
        const mod = await import(pathToFileURL(join(ruta, archivo)).href);
        const cmd = mod.default;
        if (!cmd?.nombre) continue;
        client.prefixCommands.set(cmd.nombre, cmd);
        console.log(`[PREFIX] Cargado: ${client.prefix}${cmd.nombre} (${carpeta})`);
      }
    }
  }

  async function cargarEventos() {
    const ruta = join(__dirname, 'events');
    const archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));
    for (const archivo of archivos) {
      const mod = await import(pathToFileURL(join(ruta, archivo)).href);
      const evento = mod.default;
      if (!evento?.name) continue;
      if (evento.once) {
        client.once(evento.name, (...args) => evento.execute(client, ...args));
      } else {
        client.on(evento.name, (...args) => evento.execute(client, ...args));
      }
      console.log(`[EVT] Registrado: ${evento.name}`);
    }
  }

  await cargarSlashCommands();
  await cargarPrefixCommands();
  await cargarEventos();

  client.login(process.env.DISCORD_TOKEN);
  