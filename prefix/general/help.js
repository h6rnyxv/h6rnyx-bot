import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
  nombre: 'help',
  async ejecutar({ client, message }) {
    const p = client.prefix;

    const embed = new EmbedBuilder()
      .setTitle('✨ Comandos del Bot')
      .setColor('#5865F2')
      .setDescription('Selecciona una categoría del menú para ver sus comandos.')
      .addFields(
        { name: '🎉 Diversión', value: '11 comandos', inline: true },
        { name: '🛡️ Moderación', value: '10 comandos', inline: true },
        { name: '🛠️ General', value: '5 comandos', inline: true },
        { name: '🔑 Owner (Slash)', value: '/genkey /revokekey /checkkey /ticket', inline: false },
      )
      .setFooter({
        text: `${message.author.username} • Prefix: ${p}`,
        iconURL: message.author.displayAvatarURL(),
      });

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select-categoria')
        .setPlaceholder('📂 Selecciona una categoría...')
        .addOptions([
          { label: '🎉 Diversión', description: 'Comandos de entretenimiento', value: 'diversion', emoji: '🎉' },
          { label: '🛡️ Moderación', description: 'Comandos de moderación', value: 'moderacion', emoji: '🛡️' },
          { label: '🛠️ General', description: 'Comandos básicos', value: 'general', emoji: '🛠️' },
        ])
    );

    message.reply({ embeds: [embed], components: [menu] });
  },
};
