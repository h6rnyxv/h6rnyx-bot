import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
  import { getLogTicketOpenChannel, getLogTicketCloseChannel } from './settings.js';

  export async function sendTicketOpenLog(client, guildId, { usuario, canal, numero, idioma }) {
    const channelId = getLogTicketOpenChannel(guildId);
    if (!channelId) return;
    const ch = client.channels.cache.get(channelId);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setTitle(`🎫 Ticket Abierto — #${numero}`)
      .setColor(0x57f287)
      .addFields(
        { name: '👤 Usuario', value: `${usuario}`, inline: true },
        { name: '📁 Canal',   value: canal,          inline: true },
        { name: '🌐 Idioma',  value: idioma === 'en' ? '🇬🇧 English' : '🇪🇸 Español', inline: true },
      )
      .setTimestamp();

    ch.send({ embeds: [embed] }).catch(() => {});
  }

  export async function sendTicketCloseLog(client, guildId, { usuario, cerradoPor, canal, numero, idioma, razon, transcript }) {
    const channelId = getLogTicketCloseChannel(guildId);
    if (!channelId) return;
    const ch = client.channels.cache.get(channelId);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setTitle(`🔒 Ticket Cerrado — #${numero}`)
      .setColor(0xed4245)
      .addFields(
        { name: '👤 Usuario',     value: `${usuario}`,    inline: true },
        { name: '🔑 Cerrado por', value: `${cerradoPor}`, inline: true },
        { name: '🌐 Idioma',      value: idioma === 'en' ? '🇬🇧 English' : '🇪🇸 Español', inline: true },
        { name: '📁 Canal',       value: canal, inline: true },
        { name: '📝 Razón',       value: razon || 'Sin razón especificada', inline: false },
      )
      .setTimestamp();

    const files = [];
    if (transcript) {
      const buf = Buffer.from(transcript, 'utf-8');
      files.push(new AttachmentBuilder(buf, { name: `transcript-${numero}.txt` }));
    }

    ch.send({ embeds: [embed], files }).catch(() => {});
  }
  