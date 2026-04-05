export default {
  nombre: 'limpiamd',
  descripcion: 'Borra todos los mensajes del bot en el MD con el owner.',
  owner: true,

  async ejecutar({ client, message }) {
    try {
      const dmChannel = await message.author.createDM();
      let fetched;

      do {
        fetched = await dmChannel.messages.fetch({ limit: 100 });
        const botMessages = fetched.filter((msg) => msg.author.id === client.user.id);
        for (const msg of botMessages.values()) {
          await msg.delete().catch(() => {});
        }
      } while (fetched.size >= 2);

      await message.author.send('✅ He borrado todos mis mensajes en MD contigo.').catch(() => {});
    } catch (err) {
      console.error(err);
    }
  },
};
