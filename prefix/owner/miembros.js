export default {
  nombre: 'miembros',
  descripcion: 'Muestra los miembros de un servidor por su ID.',
  owner: true,

  async ejecutar({ client, message, args }) {
    const serverId = args[0];
    if (!serverId) return message.reply('⚠️ Uso: `!miembros <ID del servidor>`');

    const guild = client.guilds.cache.get(serverId);
    if (!guild) return message.reply('❌ No se encontró ese servidor o el bot no está en él.');

    await guild.members.fetch();
    const lista = guild.members.cache.map((m) => `${m.displayName} (${m.user.tag})`);

    const partes = [];
    let actual = '';
    for (const linea of lista) {
      if ((actual + linea + '\n').length > 1900) {
        partes.push(actual);
        actual = '';
      }
      actual += linea + '\n';
    }
    if (actual) partes.push(actual);

    for (const parte of partes) {
      await message.author.send(`\`\`\`\n${parte}\`\`\``).catch(() => {});
    }

    message.reply(`✅ Lista de **${lista.length}** miembros enviada por DM.`);
  },
};
