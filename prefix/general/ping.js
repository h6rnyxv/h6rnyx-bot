export default {
  nombre: 'ping',
  descripcion: 'Muestra la latencia del bot.',
  owner: false,

  async ejecutar({ client, message }) {
    const enviado = await message.reply('🏓 Calculando...');
    const latencia = enviado.createdTimestamp - message.createdTimestamp;
    const apiLatencia = Math.round(client.ws.ping);

    await enviado.edit(
      `🏓 **Pong!**\n> Latencia del mensaje: \`${latencia}ms\`\n> Latencia de la API: \`${apiLatencia}ms\``
    );
  },
};
