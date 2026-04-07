import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
  nombre: 'help',
  descripcion: 'Muestra el menú de ayuda con todas las categorías.',
  owner: false,

  async ejecutar({ client, message }) {
    const embed = new EmbedBuilder()
      .setTitle('✨ Comandos de Layout')
      .setColor('#FFC0CB')
      .setDescription('Selecciona una categoría del menú para ver sus comandos.')
      .addFields(
        { name: '🎉 Diversión', value: '11 comandos', inline: true },
        { name: '🛡️ Moderación', value: '10 comandos', inline: true },
        { name: '🛠️ Utilidad', value: '9 comandos', inline: true },
        { name: '⚙️ Gestión del Servidor', value: '6 comandos', inline: true },
        { name: '📌 General', value: '2 comandos', inline: true },
      )
      .setFooter({
        text: `Solicitado por ${message.author.username} • Prefix: ${client.prefix}`,
        iconURL: message.author.displayAvatarURL(),
      });

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select-categoria')
        .setPlaceholder('📂 Selecciona una categoría...')
        .addOptions([
          { label: '🎉 Diversión', description: 'Comandos de entretenimiento', value: 'diversion', emoji: '🎉' },
          { label: '🛡️ Moderación', description: 'Comandos de moderación del servidor', value: 'moderacion', emoji: '🛡️' },
          { label: '🛠️ Utilidad', description: 'Herramientas útiles', value: 'utilidad', emoji: '🛠️' },
          { label: '⚙️ Gestión', description: 'Gestión de canales y roles', value: 'gestion', emoji: '⚙️' },
          { label: '📌 General', description: 'Comandos básicos del bot', value: 'general', emoji: '📌' },
        ])
    );

    message.reply({ embeds: [embed], components: [menu] });
  },
};
