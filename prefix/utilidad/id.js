export default {
  nombre: 'id',
  descripcion: 'Muestra el ID de un usuario o del servidor.',
  owner: false,

  async ejecutar({ message }) {
    const user = message.mentions.users.first() || message.author;
    message.channel.send(`🆔 ID de **${user.username}**: \`${user.id}\`\n🏠 ID del servidor: \`${message.guild.id}\``);
  },
};
