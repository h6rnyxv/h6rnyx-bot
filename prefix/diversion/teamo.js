export default {
  nombre: 'teamo',
  descripcion: 'Responde con cariño.',
  owner: false,

  async ejecutar({ message }) {
    message.reply('💖 ¡Yo también te quiero mucho!');
  },
};
