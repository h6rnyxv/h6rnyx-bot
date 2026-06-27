import { embed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'serverinfo',
    descripcion: 'Muestra información detallada del servidor.',
    owner: false,

    async ejecutar({ message }) {
      const { guild } = message;
      const bots   = guild.members.cache.filter(m => m.user.bot).size;
      const humanos = guild.memberCount - bots;
      const cats   = guild.channels.cache.filter(c => c.type === 4).size;
      const texto  = guild.channels.cache.filter(c => c.type === 0).size;
      const voz    = guild.channels.cache.filter(c => c.type === 2).size;

      message.channel.send({ embeds: [embed({
        author: { name: guild.name, iconURL: guild.iconURL({ dynamic: true }) ?? undefined },
        color: COLORS.gold,
        thumbnail: guild.iconURL({ dynamic: true }) ?? undefined,
        fields: [
          { name: '👑 Dueño',      value: `<@${guild.ownerId}>`,                       inline: true },
          { name: '👥 Miembros',   value: `${guild.memberCount} (${humanos} 👤 / ${bots} 🤖)`, inline: true },
          { name: '📁 Canales',   value: `${cats} categorías · ${texto} texto · ${voz} voz`, inline: false },
          { name: '🎭 Roles',     value: `${guild.roles.cache.size}`,                  inline: true },
          { name: '😀 Emojis',    value: `${guild.emojis.cache.size}`,                 inline: true },
          { name: '🌍 Región',    value: guild.preferredLocale,                          inline: true },
          { name: '📅 Creado',    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D> (<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`, inline: false },
        ],
        footer: { text: `ID: ${guild.id}` },
      })] });
    },
  };