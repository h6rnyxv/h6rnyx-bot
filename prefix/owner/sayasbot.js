export default {
  nombre: 'sayasbot',
  descripcion: 'El bot envía un mensaje en el canal como si fuera él.',
  owner: true,

  async ejecutar({ message, args }) {
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir un mensaje.');
    await message.delete().catch(() => {});
    message.channel.send(texto);
  },
};
