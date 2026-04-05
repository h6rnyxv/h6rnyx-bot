import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'avatar',
  async ejecutar({ message }) {
    const miembro = message.mentions.members.first() || message.member;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar de ${miembro.displayName}`)
      .setImage(miembro.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor(0x5865f2);
    message.channel.send({ embeds: [embed] });
  },
};
