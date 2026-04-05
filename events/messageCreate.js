export default {
  name: 'messageCreate',
  once: false,

  async execute(client, message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content.slice(client.prefix.length).trim().split(/\s+/);
    const nombreComando = args.shift().toLowerCase();

    const comando = client.prefixCommands.get(nombreComando);
    if (!comando) return;

    try {
      await comando.ejecutar({ client, message, args });
    } catch (err) {
      console.error(`[ERROR] Prefix /${nombreComando}:`, err);
      message.reply('❌ Ocurrió un error al ejecutar el comando.').catch(() => {});
    }
  },
};
