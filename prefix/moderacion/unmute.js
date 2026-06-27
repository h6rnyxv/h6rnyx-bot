import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'unmute',
    descripcion: 'Desmutea a un usuario.',
    uso: '<@usuario>',
    owner: false,

    async ejecutar({ message }) {
      if (!message.member.permissions.has('ModerateMembers'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para desmutear usuarios.', message.author)] });

      const miembro = message.mentions.members.first();
      if (!miembro)
        return message.reply({ embeds: [errorEmbed('Menciona a un usuario para desmutear.', message.author)] });

      try {
        await miembro.timeout(null);
        message.channel.send({ embeds: [embed({
          title: '🔈 Usuario Desmuteado',
          color: COLORS.success,
          fields: [
            { name: '👤 Usuario',    value: `${miembro.user} (\`${miembro.user.id}\`)`, inline: true },
            { name: '🛡️ Moderador', value: `${message.member}`, inline: true },
          ],
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude desmutear al usuario.', message.author)] });
      }
    },
  };