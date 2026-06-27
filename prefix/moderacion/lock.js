import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'lock',
    descripcion: 'Bloquea el canal para que nadie pueda escribir.',
    owner: false,

    async ejecutar({ message }) {
      if (!message.member.permissions.has('ManageChannels'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para bloquear canales.', message.author)] });

      try {
        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
        message.channel.send({ embeds: [embed({
          title: '🔒 Canal Bloqueado',
          description: `${message.channel} fue bloqueado por ${message.member}.`,
          color: COLORS.error,
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude bloquear el canal.', message.author)] });
      }
    },
  };