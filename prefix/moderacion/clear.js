export default {
  nombre: 'clear',
  descripcion: 'Elimina una cantidad de mensajes del canal.',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ManageMessages'))
      return message.reply('❌ No tienes permiso para borrar mensajes.');

    const cantidad = parseInt(args[0]);
    if (isNaN(cantidad) || cantidad < 1 || cantidad > 100)
      return message.reply('❌ Debes especificar una cantidad entre 1 y 100.');

    try {
      const eliminados = await message.channel.bulkDelete(cantidad + 1, true);
      const aviso = await message.channel.send(`🗑️ Se eliminaron **${eliminados.size - 1}** mensajes.`);
      setTimeout(() => aviso.delete().catch(() => {}), 4000);
    } catch {
      message.reply('❌ No pude eliminar los mensajes. Los mensajes de más de 14 días no se pueden borrar en masa.');
    }
  },
};
