export default {
  nombre: 'ban',
  descripcion: 'Banea a un usuario del servidor.',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('BanMembers'))
      return message.reply('❌ No tienes permiso para banear usuarios.');

    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario para banear.');

    const razon = args.slice(1).join(' ') || 'Sin razón especificada';

    try {
      await miembro.ban({ reason: razon });
      message.channel.send(`🔨 **${miembro.user.tag}** ha sido baneado. Razón: *${razon}*`);
    } catch {
      message.reply('❌ No pude banear a ese usuario. Verifica mis permisos.');
    }
  },
};
