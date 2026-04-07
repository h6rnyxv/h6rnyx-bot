export default {
  nombre: 'beso',
  descripcion: 'Besa a otro usuario.',
  owner: false,

  async ejecutar({ message }) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('💋 Menciona a alguien para besar.');
    message.channel.send(`💋 **${message.author.username}** le dio un beso a **${user.username}**!`);
  },
};
