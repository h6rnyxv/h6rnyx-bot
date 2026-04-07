export default {
  nombre: 'unmute',
  descripcion: 'Desmutea a un usuario.',
  owner: false,

  async ejecutar({ message }) {
    if (!message.member.permissions.has('ModerateMembers'))
      return message.reply('❌ No tienes permiso para desmutear usuarios.');

    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario para desmutear.');

    try {
      await miembro.timeout(null);
      message.channel.send(`🔈 **${miembro.user.tag}** ha sido desmuteado.`);
    } catch {
      message.reply('❌ No pude desmutear a ese usuario.');
    }
  },
};
