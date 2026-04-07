export default {
  nombre: 'mute',
  descripcion: 'Silencia a un usuario (por defecto 1 minuto).',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ModerateMembers'))
      return message.reply('❌ No tienes permiso para silenciar usuarios.');

    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario para silenciar.');

    const minutos = parseInt(args[1]) || 1;
    const duracion = minutos * 60 * 1000;

    try {
      await miembro.timeout(duracion, `Silenciado por ${message.member.displayName}`);
      message.channel.send(`🔇 **${miembro.user.tag}** ha sido silenciado por **${minutos}** minuto(s).`);
    } catch {
      message.reply('❌ No pude silenciar a ese usuario.');
    }
  },
};
