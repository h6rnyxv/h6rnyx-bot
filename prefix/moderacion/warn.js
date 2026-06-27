import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'warn',
    descripcion: 'Advierte a un usuario con una razón y le envía DM.',
    uso: '<@usuario> [razón]',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('ModerateMembers'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para advertir usuarios.', message.author)] });

      const usuario = message.mentions.users.first();
      if (!usuario)
        return message.reply({ embeds: [errorEmbed('Menciona a alguien para advertir.', message.author)] });

      const razon = args.slice(1).join(' ') || 'Sin razón especificada';

      message.channel.send({ embeds: [embed({
        title: '⚠️ Advertencia Emitida',
        color: COLORS.warning,
        fields: [
          { name: '👤 Usuario',    value: `<@${usuario.id}> (\`${usuario.id}\`)`, inline: true },
          { name: '🛡️ Moderador', value: `${message.member}`, inline: true },
          { name: '📋 Razón',     value: razon },
        ],
        footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
      })] });

      usuario.send({ embeds: [embed({
        title: '⚠️ Has recibido una advertencia',
        color: COLORS.warning,
        fields: [
          { name: '🏠 Servidor',   value: message.guild.name, inline: true },
          { name: '🛡️ Moderador', value: message.member.displayName, inline: true },
          { name: '📋 Razón',     value: razon },
        ],
      })] }).catch(() => {});
    },
  };