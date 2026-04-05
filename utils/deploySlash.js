import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const REQUIRED = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
for (const v of REQUIRED) {
  if (!process.env[v]) {
    console.error(`[ERROR] Falta: ${v}`);
    process.exit(1);
  }
}

const commands = [];
const ruta = join(__dirname, '..', 'commands');
const archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));

for (const archivo of archivos) {
  const mod = await import(pathToFileURL(join(ruta, archivo)).href);
  const cmd = mod.default;
  if (cmd?.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

console.log(`[DEPLOY] Registrando ${commands.length} comando(s) slash...`);

await rest.put(
  Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
  { body: commands }
);

console.log('[DEPLOY] ✅ Comandos slash registrados.');
