import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

  export default {
    nombre: 'help',
    descripcion: 'Muestra el menú de ayuda con todas las categorías.',
    owner: false,

    async ejecutar({ client, message }) {
      const p = client.prefix;

      const embed = new EmbedBuilder()
        .setTitle('✨ Comandos del Bot')
        .setColor('#5865F2')
        .setDescription('Selecciona una categoría del menú para ver sus comandos.')
        .addFields(
          { name: '🎉 Diversión', value: '11 comandos', inline: true },
          { name: '🛡️ Moderación', value: '10 comandos', inline: true },
          { name: '🛠️ Utilidad', value: '8 comandos', inline: true },
          { name: '⚙️ Servidor', value: '6 comandos', inline: true },
          { name: '📌 General', value: '6 comandos', inline: true },
          { name: '🔑 Owner (Slash)', value: '/genkey /revokekey /checkkey /ticket /verificar', inline: false },
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
            { label: '🎉 Diversión',  description: 'Comandos de entretenimiento',  value: 'diversion',  emoji: '🎉' },
            { label: '🛡️ Moderación', description: 'Comandos de moderación',        value: 'moderacion', emoji: '🛡️' },
            { label: '🛠️ Utilidad',   description: 'Herramientas útiles',           value: 'utilidad',   emoji: '🛠️' },
            { label: '⚙️ Servidor',   description: 'Gestión de canales y roles',    value: 'server',     emoji: '⚙️' },
            { label: '📌 General',    description: 'Comandos básicos del bot',      value: 'general',    emoji: '📌' },
          ])
      );

      message.reply({ embeds: [embed], components: [menu] });
    },
  };
  