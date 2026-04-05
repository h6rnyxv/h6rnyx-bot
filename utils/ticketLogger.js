import { EmbedBuilder } from 'discord.js';
  import { getLogTicketChannel } from './settings.js';

  export async function sendTicketLog(client, guildId, { accion, usuario, canal, numero, idioma }) {
    const channelId = getLogTicketChannel(guildId);
    if (!channelId) return;
    const ch = client.channels.cache.get(channelId);
    if (!ch) return;

    const colores = { abierto: 0x57f287, cerrado: 0xed4245 };
    const iconos  = { abierto: '🎫', cerrado: '🔒' };

    const embed = new EmbedBuilder()
      .setTitle(`${iconos[accion] || '📋'} Ticket ${accion === 'abierto' ? 'Abierto' : 'Cerrado'} — #${numero}`)
      .setColor(colores[accion] || 0x99aab5)
      .addFields(
        { name: '👤 Usuario', value: `${usuario}`, inline: true },
        { name: '📁 Canal',   value: canal,          inline: true },
        { name: '🌐 Idioma',  value: idioma === 'en' ? '🇬🇧 Inglés' : '🇪🇸 Español', inline: true },
      )
      .setTimestamp();

    ch.send({ embeds: [embed] }).catch(() => {});
  }
  