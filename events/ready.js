import { ActivityType } from 'discord.js';
  import { readFileSync, writeFileSync, existsSync } from 'fs';
  import { join, dirname } from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const DEPLOY_FILE = join(__dirname, '..', '.last_deploy_id');

  export default {
    name: 'clientReady',
    once: true,

    async execute(client) {
      console.log(`[BOT] ✅ Conectado como ${client.user.tag}`);
      console.log(`[BOT] Servidores: ${client.guilds.cache.size}`);
      client.user.setActivity('My Prefix is !', { type: ActivityType.Watching });

      // ── Sistema de notificación de deploy ──────────────────────────────────
      const deployId = process.env.RAILWAY_DEPLOYMENT_ID;
      const ownerId  = process.env.DISCORD_OWNER_ID;

      if (deployId && ownerId) {
        const lastId = existsSync(DEPLOY_FILE) ? readFileSync(DEPLOY_FILE, 'utf-8').trim() : null;

        if (deployId !== lastId) {
          // Es un deploy nuevo — guardar el ID y notificar al owner
          writeFileSync(DEPLOY_FILE, deployId);

          try {
            const owner = await client.users.fetch(ownerId);
            const { EmbedBuilder } = await import('discord.js');
            const now = new Date();
            const embed = new EmbedBuilder()
              .setTitle('🚀 Deploy Exitoso')
              .setColor(0x2ecc71)
              .addFields(
                { name: '📦 Proyecto',   value: process.env.RAILWAY_PROJECT_NAME || 'h6rnyx-bot', inline: true },
                { name: '🌿 Entorno',    value: process.env.RAILWAY_ENVIRONMENT_NAME || 'production', inline: true },
                { name: '🆔 Deploy ID',  value: `\`${deployId.slice(0, 8)}...\``, inline: false },
                { name: '🕐 Hora',       value: `<t:${Math.floor(now.getTime() / 1000)}:F>`, inline: false },
                { name: '✅ Estado',     value: 'El bot arrancó correctamente', inline: false },
              )
              .setFooter({ text: 'Railway · h6rnyx-bot' })
              .setTimestamp();

            await owner.send({ embeds: [embed] });
            console.log('[DEPLOY] ✅ DM de deploy enviado al owner.');
          } catch (err) {
            console.error('[DEPLOY] No se pudo enviar DM al owner:', err.message);
          }
        }
      }
      // ───────────────────────────────────────────────────────────────────────

      // Registrar slash commands
      const { REST, Routes } = await import('discord.js');
      const { readdirSync } = await import('fs');
      const { join: pathJoin } = await import('path');
      const { pathToFileURL } = await import('url');

      const commands = [];
      const ruta = pathJoin(__dirname, '..', 'commands');
      const archivos = readdirSync(ruta).filter(f => f.endsWith('.js'));

      for (const archivo of archivos) {
        const mod = await import(pathToFileURL(pathJoin(ruta, archivo)).href);
        const cmd = mod.default;
        if (cmd?.data) commands.push(cmd.data.toJSON());
      }

      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
          { body: commands }
        );
        console.log(`[SLASH] ✅ ${commands.length} comando(s) registrado(s).`);
      } catch (err) {
        console.error('[SLASH] Error al registrar comandos:', err.message);
      }
    },
  };
  