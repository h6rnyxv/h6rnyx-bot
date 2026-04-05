const activeCollectors = new Map();

export default {
  nombre: 'msl',
  descripcion: 'Envía un MD a un usuario y retransmite sus respuestas al canal. Úsalo de nuevo para detener.',
  owner: true,

  async ejecutar({ client, message, args }) {
    const target = message.mentions.users.first()
      || await client.users.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Debes mencionar o proporcionar la ID de un usuario.');

    const msgArgs = message.mentions.users.first() ? args.slice(1) : args.slice(1);
    const texto = msgArgs.join(' ');

    if (activeCollectors.has(target.id)) {
      activeCollectors.get(target.id).stop('cancelado');
      activeCollectors.delete(target.id);
      return message.reply(`🔕 Escucha de MD con **${target.tag}** cancelada.`);
    }

    if (!texto) return message.reply('❌ Escribe un mensaje para enviar. Ej: `!msl @usuario hola`');

    try {
      const dm = await target.send(texto);
      message.channel.send(`✅ Mensaje enviado a **${target.tag}**. Escuchando respuestas...`);

      const collector = dm.channel.createMessageCollector({ filter: (m) => m.author.id === target.id });
      activeCollectors.set(target.id, collector);

      collector.on('collect', (resp) => {
        message.channel.send(`📨 **${target.tag}** respondió:\n> ${resp.content}`);
      });

      collector.on('end', (_, reason) => {
        if (reason !== 'cancelado') activeCollectors.delete(target.id);
      });
    } catch {
      message.reply('❌ No pude enviar el MD. ¿El usuario tiene los DMs desactivados?');
    }
  },
};
