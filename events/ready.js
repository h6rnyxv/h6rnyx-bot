export default {
  name: 'clientReady',
  once: true,

  async execute(client) {
    console.log(`[BOT] ✅ Conectado como ${client.user.tag}`);
    console.log(`[BOT] Servidores: ${client.guilds.cache.size}`);
    client.user.setActivity('h6rnyx KeyServer | /checkkey');

    const { REST, Routes } = await import('discord.js');
    const { readdirSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath, pathToFileURL } = await import('url');
    const { createRequire } = await import('module');

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commands = [];
    const ruta = join(__dirname, '..', 'commands');
    const archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));

    for (const archivo of archivos) {
      const mod = await import(pathToFileURL(join(ruta, archivo)).href);
      const cmd = mod.default;
      if (cmd?.data) commands.push(cmd.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
        { body: commands }
      );
      console.log(`[SLASH] ✅ ${commands.length} comando(s) registrado(s) en el servidor.`);
    } catch (err) {
      console.error('[SLASH] Error al registrar comandos:', err.message);
    }
  },
};
