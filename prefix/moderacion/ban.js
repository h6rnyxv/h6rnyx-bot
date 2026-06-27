import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'ban',
    descripcion: 'Banea a un usuario del servidor.',
    uso: '<@usuario> [razón]',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('BanMembers'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para banear usuarios.', message.author)] });

      const miembro = message.mentions.members.first();
      if (!miembro)
        return message.reply({ embeds: [errorEmbed('Menciona a un usuario para banear.', message.author)] });

      if (!miembro.bannable)
        return message.reply({ embeds: [errorEmbed('No puedo banear a ese usuario (su rol es igual o superior al mío).', message.author)] });

      const razon = args.slice(1).join(' ') || 'Sin razón especificada';
      try {
        await miembro.ban({ reason: razon });
        message.channel.send({ embeds: [embed({
          title: '🔨 Usuario Baneado',
          color: COLORS.error,
          fields: [
            { name: '👤 Usuario', value: `${miembro.user} (\`${miembro.user.id}\`)`, inline: true },
            { name: '🛡️ Moderador', value: `${message.member}`, inline: true },
            { name: '📋 Razón', value: razon },
          ],
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude banear al usuario. Verifica mis permisos.', message.author)] });
      }
    },
  };