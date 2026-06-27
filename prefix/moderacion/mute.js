import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'mute',
    descripcion: 'Silencia a un usuario por un tiempo determinado.',
    uso: '<@usuario> [minutos] [razón]',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('ModerateMembers'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para silenciar usuarios.', message.author)] });

      const miembro = message.mentions.members.first();
      if (!miembro)
        return message.reply({ embeds: [errorEmbed('Menciona a un usuario para silenciar.', message.author)] });

      const minutos = parseInt(args[1]) || 1;
      if (minutos < 1 || minutos > 40320)
        return message.reply({ embeds: [errorEmbed('La duración debe estar entre 1 y 40320 minutos (28 días).', message.author)] });

      const razon = args.slice(2).join(' ') || 'Sin razón especificada';
      const duracion = minutos * 60 * 1000;
      try {
        await miembro.timeout(duracion, razon);
        const hasta = Math.floor((Date.now() + duracion) / 1000);
        message.channel.send({ embeds: [embed({
          title: '🔇 Usuario Silenciado',
          color: COLORS.mute,
          fields: [
            { name: '👤 Usuario',    value: `${miembro.user} (\`${miembro.user.id}\`)`, inline: true },
            { name: '🛡️ Moderador', value: `${message.member}`, inline: true },
            { name: '⏱️ Duración',  value: `${minutos} minuto(s)`, inline: true },
            { name: '🕐 Hasta',     value: `<t:${hasta}:R>`, inline: true },
            { name: '📋 Razón',     value: razon },
          ],
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude silenciar al usuario.', message.author)] });
      }
    },
  };