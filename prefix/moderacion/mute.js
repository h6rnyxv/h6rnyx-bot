export default {
  nombre: 'mute',
  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ModerateMembers'))
      return message.reply('❌ No tienes permiso para silenciar usuarios.');
    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario para silenciar.');
    const minutos = parseInt(args[1]) || 1;
    try {
      await miembro.timeout(minutos * 60 * 1000, `Silenciado por ${message.member.displayName}`);
      message.channel.send(`🔇 **${miembro.user.tag}** silenciado por **${minutos}** minuto(s).`);
    } catch {
      message.reply('❌ No pude silenciar a ese usuario.');
    }
  },
};
