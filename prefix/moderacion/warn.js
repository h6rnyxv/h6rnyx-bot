export default {
  nombre: 'warn',
  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ModerateMembers'))
      return message.reply('❌ No tienes permiso para advertir usuarios.');
    const usuario = message.mentions.users.first();
    if (!usuario) return message.reply('❌ Menciona a alguien para advertir.');
    const razon = args.slice(1).join(' ') || 'Sin razón especificada';
    message.channel.send(`⚠️ **${message.member.displayName}** advirtió a **${usuario.username}**\n> Razón: *${razon}*`);
  },
};
