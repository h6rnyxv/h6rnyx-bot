import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'slowmode',
    descripcion: 'Activa o desactiva el slowmode (0 para desactivar, máx 21600s).',
    uso: '<segundos>',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('ManageChannels'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para cambiar el slowmode.', message.author)] });

      const segundos = parseInt(args[0]);
      if (isNaN(segundos) || segundos < 0 || segundos > 21600)
        return message.reply({ embeds: [errorEmbed('Especifica los segundos (0–21600). Usa `0` para desactivarlo.', message.author)] });

      try {
        await message.channel.setRateLimitPerUser(segundos);
        message.channel.send({ embeds: [embed({
          title: segundos === 0 ? '🔓 Slowmode Desactivado' : '🐢 Slowmode Activado',
          description: segundos === 0
            ? `Slowmode desactivado por ${message.member}.`
            : `Slowmode de **${segundos}s** establecido por ${message.member}.`,
          color: segundos === 0 ? COLORS.success : COLORS.warning,
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude cambiar el slowmode.', message.author)] });
      }
    },
  };