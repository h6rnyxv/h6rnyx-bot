export default {
  nombre: 'abrazo',
  descripcion: 'Abrazas a otro usuario.',
  owner: false,

  async ejecutar({ message }) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('🤗 Menciona a alguien para abrazar.');
    message.channel.send(`🤗 **${message.author.username}** le dio un abrazo a **${user.username}**!`);
  },
};
