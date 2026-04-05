export default {
  nombre: 'howgay',
  async ejecutar({ message }) {
    const target = message.mentions.users.first() || message.author;
    const porcentaje = Math.floor(Math.random() * 101);
    message.channel.send(`🌈 ${target} es **${porcentaje}%** gay`);
  },
};
