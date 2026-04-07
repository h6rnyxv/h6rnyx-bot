const cooldowns = new Set();

export default {
  nombre: 'say',
  descripcion: 'El bot repite lo que escribas (cooldown de 6 segundos).',
  owner: false,

  async ejecutar({ message, args }) {
    if (cooldowns.has(message.author.id)) {
      return message.reply('⏳ Espera 6 segundos antes de volver a usar este comando.');
    }

    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir un mensaje.');

    const sanitizado = texto
      .replace(/@everyone/g, '`@everyone`')
      .replace(/@here/g, '`@here`');

    await message.delete().catch(() => {});
    message.channel.send(sanitizado);

    cooldowns.add(message.author.id);
    setTimeout(() => cooldowns.delete(message.author.id), 6000);
  },
};
