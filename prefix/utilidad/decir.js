export default {
  nombre: 'decir',
  descripcion: 'El bot repite tu mensaje en el canal.',
  owner: false,

  async ejecutar({ message, args }) {
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir algo para decir.');
    await message.delete().catch(() => {});
    message.channel.send(texto);
  },
};
