export default {
  nombre: 'ship',
  descripcion: 'Calcula compatibilidad entre dos personas.',
  owner: false,

  async ejecutar({ message }) {
    const usuarios = [...message.mentions.users.values()];
    if (usuarios.length < 2) return message.reply('❤️ Menciona a dos personas para shipearlas.');
    const [user1, user2] = usuarios;
    const porcentaje = Math.floor(Math.random() * 100) + 1;
    const barra = '█'.repeat(Math.floor(porcentaje / 10)) + '░'.repeat(10 - Math.floor(porcentaje / 10));
    message.channel.send(
      `💘 **${user1.username}** + **${user2.username}**\n\`[${barra}]\` **${porcentaje}%** de compatibilidad`
    );
  },
};
