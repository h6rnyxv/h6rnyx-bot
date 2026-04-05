export default {
  nombre: 'anuncio',
  descripcion: 'Envía un anuncio a todos los servidores donde está el bot.',
  owner: true,

  async ejecutar({ client, message, args }) {
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir el mensaje del anuncio.');

    let enviados = 0;
    for (const guild of client.guilds.cache.values()) {
      try {
        const canal = guild.channels.cache.find(
          (c) => c.type === 0 && c.permissionsFor(guild.members.me).has('SendMessages')
        );
        if (canal) {
          await canal.send(`**📢 Anuncio del Owner:**\n${texto}`);
          enviados++;
        }
      } catch {}
    }

    message.reply(`✅ Anuncio enviado a **${enviados}** servidor(es).`);
  },
};
