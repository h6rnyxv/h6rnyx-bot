export default {
  nombre: 'serversid',
  descripcion: 'Muestra los IDs de todos los servidores donde está el bot.',
  owner: true,

  async ejecutar({ client, message }) {
    const lista = client.guilds.cache.map((g) => `🏠 **${g.name}** → \`${g.id}\``).join('\n');
    if (!lista) return message.reply('🚫 El bot no está en ningún servidor.');

    try {
      await message.author.send(`📋 **Servidores (${client.guilds.cache.size}):**\n\n${lista}`);
      message.reply('📨 Lista enviada por DM.');
    } catch {
      message.reply(`📋 **Servidores:**\n${lista}`);
    }
  },
};
