export default {
  nombre: 'unlock',
  async ejecutar({ message }) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('❌ No tienes permiso para desbloquear canales.');
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
      message.channel.send('🔓 Este canal ha sido desbloqueado.');
    } catch {
      message.reply('❌ No pude desbloquear el canal.');
    }
  },
};
