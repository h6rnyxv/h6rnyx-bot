import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'unlock',
    descripcion: 'Desbloquea el canal actual.',
    owner: false,

    async ejecutar({ message }) {
      if (!message.member.permissions.has('ManageChannels'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para desbloquear canales.', message.author)] });

      try {
        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
        message.channel.send({ embeds: [embed({
          title: '🔓 Canal Desbloqueado',
          description: `${message.channel} fue desbloqueado por ${message.member}.`,
          color: COLORS.success,
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude desbloquear el canal.', message.author)] });
      }
    },
  };