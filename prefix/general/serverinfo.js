import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'serverinfo',
  descripcion: 'Muestra información del servidor.',
  owner: false,

  async ejecutar({ message }) {
    const { guild } = message;
    const embed = new EmbedBuilder()
      .setTitle(`📊 ${guild.name}`)
      .addFields(
        { name: '👑 Dueño', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
        { name: '📁 Canales', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor('Gold');

    message.channel.send({ embeds: [embed] });
  },
};
