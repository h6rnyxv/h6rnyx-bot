export default {
  nombre: 'nuke',
  async ejecutar({ message }) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('❌ No tienes permiso para usar este comando.');
    try {
      const posicion = message.channel.position;
      const canalNuevo = await message.channel.clone({ reason: `Nuke por ${message.author.tag}` });
      await canalNuevo.setPosition(posicion);
      await message.channel.delete();
      canalNuevo.send('💥 **¡Canal nukeado!** Este canal fue reiniciado.');
    } catch {
      message.reply('❌ No pude nukear el canal.');
    }
  },
};
