import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'userinfo',
  descripcion: 'Muestra información de un usuario.',
  owner: false,

  async ejecutar({ message }) {
    const user = message.mentions.users.first() || message.author;
    const miembro = message.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.username}`)
      .addFields(
        { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Sí' : 'No', inline: true },
        { name: '📅 Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: false },
        { name: '📥 Se unió al servidor', value: miembro ? `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:R>` : 'Desconocido', inline: false },
        { name: '🎭 Roles', value: miembro ? miembro.roles.cache.filter((r) => r.id !== message.guild.id).map((r) => `${r}`).join(' ') || 'Ninguno' : 'Desconocido', inline: false },
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor('Purple');

    message.channel.send({ embeds: [embed] });
  },
};
