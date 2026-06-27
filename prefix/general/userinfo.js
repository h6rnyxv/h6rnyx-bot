import { embed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'userinfo',
    descripcion: 'Muestra información de un usuario.',
    uso: '[@usuario]',
    owner: false,

    async ejecutar({ message }) {
      const user    = message.mentions.users.first() || message.author;
      const miembro = message.guild.members.cache.get(user.id);
      const roles   = miembro?.roles.cache.filter(r => r.id !== message.guild.id).map(r => `${r}`).join(' ') || 'Ninguno';

      message.channel.send({ embeds: [embed({
        author: { name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) },
        thumbnail: user.displayAvatarURL({ dynamic: true, size: 256 }),
        color: COLORS.primary,
        fields: [
          { name: '🆔 ID',              value: `\`${user.id}\``,                                                          inline: true },
          { name: '🤖 Bot',             value: user.bot ? 'Sí' : 'No',                                                          inline: true },
          { name: '📅 Cuenta creada',   value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`, inline: false },
          { name: '📥 Se unió',         value: miembro ? `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:D> (<t:${Math.floor(miembro.joinedTimestamp / 1000)}:R>)` : 'Desconocido', inline: false },
          { name: `🎭 Roles (${miembro?.roles.cache.size - 1 || 0})`, value: roles.length > 1024 ? roles.slice(0, 1021) + '...' : roles, inline: false },
        ],
        footer: { text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() },
      })] });
    },
  };