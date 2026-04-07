export default {
  nombre: 'dado',
  descripcion: 'Lanza un dado de 6 caras.',
  owner: false,

  async ejecutar({ message, args }) {
    const caras = parseInt(args[0]) || 6;
    if (caras < 2 || caras > 100) return message.reply('⚠️ El dado debe tener entre 2 y 100 caras.');
    const numero = Math.floor(Math.random() * caras) + 1;
    message.reply(`🎲 Has sacado un **${numero}** (dado de ${caras} caras)`);
  },
};
