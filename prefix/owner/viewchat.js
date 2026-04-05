import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'viewchat',
  descripcion: 'Envía por DM el historial de mensajes de un servidor. Uso: !viewchat <serverID>',
  owner: true,

  async ejecutar({ client, message, args }) {
    const serverId = args[0];
    if (!serverId) return message.reply('⚠️ Uso: `!viewchat <ID del servidor>`');

    const guild = client.guilds.cache.get(serverId);
    if (!guild) return message.reply('❌ No se encontró ese servidor.');

    let texto = `📜 **Historial de ${guild.name}**\n\n`;

    const canalesTexto = guild.channels.cache.filter((c) => c.type === 0);

    for (const [, canal] of canalesTexto) {
      const perms = canal.permissionsFor(guild.members.me);
      if (!perms?.has(PermissionsBitField.Flags.ViewChannel) || !perms?.has(PermissionsBitField.Flags.ReadMessageHistory)) continue;

      texto += `\n# #${canal.name}\n`;
      const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
      if (!msgs) continue;

      for (const msg of [...msgs.values()].reverse()) {
        texto += `[${msg.createdAt.toLocaleString('es-ES')}] ${msg.author.tag}: ${msg.content}\n`;
      }
    }

    const partes = [];
    let actual = '';
    for (const linea of texto.split('\n')) {
      if ((actual + linea + '\n').length > 1900) { partes.push(actual); actual = ''; }
      actual += linea + '\n';
    }
    if (actual) partes.push(actual);

    await message.author.send(`📬 Historial de **${guild.name}**:`).catch(() => {});
    for (const parte of partes) {
      await message.author.send(`\`\`\`\n${parte}\`\`\``).catch(() => {});
    }

    message.reply('📨 Historial enviado por DM.');
  },
};
