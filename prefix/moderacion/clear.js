import { errorEmbed, successEmbed } from '../../utils/embed.js';

  export default {
    nombre: 'clear',
    descripcion: 'Elimina una cantidad de mensajes del canal (máx 100).',
    uso: '<cantidad>',
    owner: false,

    async ejecutar({ message, args }) {
      if (!message.member.permissions.has('ManageMessages'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para borrar mensajes.', message.author)] });

      const cantidad = parseInt(args[0]);
      if (isNaN(cantidad) || cantidad < 1 || cantidad > 100)
        return message.reply({ embeds: [errorEmbed('Especifica una cantidad entre 1 y 100.', message.author)] });

      try {
        const eliminados = await message.channel.bulkDelete(cantidad + 1, true);
        const aviso = await message.channel.send({ embeds: [successEmbed(`Se eliminaron **${eliminados.size - 1}** mensajes.`, message.author)] });
        setTimeout(() => aviso.delete().catch(() => {}), 4000);
      } catch {
        message.reply({ embeds: [errorEmbed('No pude eliminar los mensajes. Los de más de 14 días no se pueden borrar en masa.', message.author)] });
      }
    },
  };