export default {
  nombre: 'ping',
  async ejecutar({ client, message }) {
    const enviado = await message.reply('🏓 Calculando...');
    const latencia = enviado.createdTimestamp - message.createdTimestamp;
    const apiLatencia = Math.round(client.ws.ping);
    await enviado.edit(`🏓 **Pong!**\n> Latencia: \`${latencia}ms\`\n> API: \`${apiLatencia}ms\``);
  },
};
