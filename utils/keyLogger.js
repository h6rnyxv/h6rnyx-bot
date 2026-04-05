import { EmbedBuilder } from 'discord.js';
  import { getLogKeyChannel } from './settings.js';

  export async function sendKeyLog(client, guildId, { accion, ejecutadoPor, key, tipo, expira, extra }) {
    const channelId = getLogKeyChannel(guildId);
    if (!channelId) return;

    const channel = client.channels.cache.get(channelId);
    if (!channel) return;

    const colores = {
      genkey: 0x57f287,
      revokekey: 0xed4245,
      checkkey: 0x5865f2,
    };

    const iconos = {
      genkey: '🔑',
      revokekey: '🗑️',
      checkkey: '🔍',
    };

    const embed = new EmbedBuilder()
      .setTitle(`${iconos[accion] || '📋'} Log de Key — ${accion}`)
      .setColor(colores[accion] || 0x99aab5)
      .addFields(
        { name: '👤 Ejecutado por', value: ejecutadoPor, inline: true },
        { name: '🔑 Key', value: `\`${key}\``, inline: false },
      )
      .setTimestamp();

    if (tipo) embed.addFields({ name: '⏱️ Tipo', value: tipo, inline: true });
    if (expira) embed.addFields({ name: '📅 Expira', value: expira, inline: true });
    if (extra) embed.addFields({ name: '📝 Extra', value: extra, inline: false });

    channel.send({ embeds: [embed] }).catch(() => {});
  }
  