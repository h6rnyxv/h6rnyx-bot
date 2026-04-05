import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'sugerencia',
  descripcion: 'Envía una sugerencia al canal.',
  owner: false,

  async ejecutar({ message, args }) {
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Escribe tu sugerencia después del comando.');

    const embed = new EmbedBuilder()
      .setTitle('💡 Nueva Sugerencia')
      .setDescription(texto)
      .setColor('#FFD700')
      .setFooter({ text: `Sugerido por ${message.member.displayName}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {});
  },
};
