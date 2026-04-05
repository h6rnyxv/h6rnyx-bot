export default {
  nombre: 'spam',
  descripcion: 'Envía múltiples menciones a un rol o usuario. Uso: !spam @objetivo <cantidad>',
  owner: true,

  async ejecutar({ message, args }) {
    const objetivo = message.mentions.roles.first() || message.mentions.members.first();
    if (!objetivo) return message.reply('❌ Menciona un usuario o rol.');

    const cantidad = Math.min(parseInt(args[1]) || 1, 100);
    if (isNaN(cantidad) || cantidad < 1) return message.reply('❌ La cantidad debe ser entre 1 y 100.');

    await message.delete().catch(() => {});

    for (let i = 0; i < cantidad; i++) {
      await message.channel.send(`${objetivo}`).catch(() => {});
    }

    message.author.send(`✅ Se enviaron **${cantidad}** menciones a ${objetivo} en ${message.channel}.`).catch(() => {});
  },
};
