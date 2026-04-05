const cooldowns = new Set();

export default {
  nombre: 'say',
  async ejecutar({ message, args }) {
    if (cooldowns.has(message.author.id))
      return message.reply('⏳ Espera 6 segundos antes de usar este comando de nuevo.');
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir un mensaje.');
    const sanitizado = texto.replace(/@everyone/g, '`@everyone`').replace(/@here/g, '`@here`');
    await message.delete().catch(() => {});
    message.channel.send(sanitizado);
    cooldowns.add(message.author.id);
    setTimeout(() => cooldowns.delete(message.author.id), 6000);
  },
};
