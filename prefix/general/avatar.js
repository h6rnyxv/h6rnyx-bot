import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'avatar',
  descripcion: 'Muestra tu avatar o el de otro usuario.',
  owner: false,

  async ejecutar({ message }) {
    const miembro = message.mentions.members.first() || message.member;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar de ${miembro.displayName}`)
      .setImage(miembro.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor('Blurple');

    message.channel.send({ embeds: [embed] });
  },
};
