export default {
  nombre: 'kick',
  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('KickMembers'))
      return message.reply('❌ No tienes permiso para expulsar usuarios.');
    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario para expulsar.');
    const razon = args.slice(1).join(' ') || 'Sin razón especificada';
    try {
      await miembro.kick(razon);
      message.channel.send(`👢 **${miembro.user.tag}** ha sido expulsado. Razón: *${razon}*`);
    } catch {
      message.reply('❌ No pude expulsar a ese usuario.');
    }
  },
};
