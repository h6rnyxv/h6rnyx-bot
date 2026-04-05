export default {
  nombre: 'lock',
  async ejecutar({ message }) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('❌ No tienes permiso para bloquear canales.');
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      message.channel.send('🔒 Este canal ha sido bloqueado.');
    } catch {
      message.reply('❌ No pude bloquear el canal.');
    }
  },
};
