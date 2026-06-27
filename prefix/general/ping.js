import { embed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'ping',
    descripcion: 'Muestra la latencia del bot.',
    owner: false,

    async ejecutar({ client, message }) {
      const enviado = await message.reply({ embeds: [embed({ description: '🏓 Calculando...', color: COLORS.info, timestamp: false })] });
      const latencia = enviado.createdTimestamp - message.createdTimestamp;
      const api = Math.round(client.ws.ping);
      await enviado.edit({ embeds: [embed({
        title: '🏓 Pong!',
        color: api < 100 ? COLORS.success : api < 250 ? COLORS.warning : COLORS.error,
        fields: [
          { name: '📨 Latencia Mensaje', value: `\`${latencia}ms\``, inline: true },
          { name: '🌐 Latencia API',     value: `\`${api}ms\``,     inline: true },
        ],
        footer: { text: message.author.username, iconURL: message.author.displayAvatarURL() },
      })] });
    },
  };