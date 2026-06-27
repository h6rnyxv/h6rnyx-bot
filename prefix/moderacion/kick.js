import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'kick',
    descripcion: 'Expulsa a un usuario del servidor.',
    uso: '<@usuario> [razón]',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('KickMembers'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para expulsar usuarios.', message.author)] });

      const miembro = message.mentions.members.first();
      if (!miembro)
        return message.reply({ embeds: [errorEmbed('Menciona a un usuario para expulsar.', message.author)] });

      if (!miembro.kickable)
        return message.reply({ embeds: [errorEmbed('No puedo expulsar a ese usuario (su rol es igual o superior al mío).', message.author)] });

      const razon = args.slice(1).join(' ') || 'Sin razón especificada';
      try {
        await miembro.kick(razon);
        message.channel.send({ embeds: [embed({
          title: '👢 Usuario Expulsado',
          color: COLORS.mod,
          fields: [
            { name: '👤 Usuario', value: `${miembro.user} (\`${miembro.user.id}\`)`, inline: true },
            { name: '🛡️ Moderador', value: `${message.member}`, inline: true },
            { name: '📋 Razón', value: razon },
          ],
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude expulsar al usuario.', message.author)] });
      }
    },
  };