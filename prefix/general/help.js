import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
  import { COLORS } from '../../utils/embed.js';

  const CATEGORIAS = {
    diversion:  { label: '🎉 Diversión',   desc: 'Comandos de entretenimiento',    emoji: '🎉' },
    moderacion: { label: '🛡️ Moderación',  desc: 'Gestión y moderación del servidor', emoji: '🛡️' },
    utilidad:   { label: '🛠️ Utilidad',    desc: 'Herramientas útiles',            emoji: '🛠️' },
    server:     { label: '⚙️ Servidor',    desc: 'Gestión de canales y roles',     emoji: '⚙️' },
    general:    { label: '📌 General',     desc: 'Comandos básicos del bot',       emoji: '📌' },
  };

  export default {
    nombre: 'help',
    descripcion: 'Muestra el menú de ayuda con todas las categorías.',
    owner: false,

    async ejecutar({ client, message }) {
      const p = client.prefix;

      // Contar comandos por categoría dinámicamente
      const conteos = {};
      for (const [cat] of Object.entries(CATEGORIAS)) conteos[cat] = 0;
      for (const cmd of client.prefixCommands.values()) {
        const cat = cmd.categoria ?? 'general';
        if (conteos[cat] !== undefined) conteos[cat]++;
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle('📚 Menú de Ayuda')
        .setDescription(`Usa el menú para explorar los comandos. Prefijo actual: \`${p}\``)
        .setColor(COLORS.primary)
        .addFields(
          Object.entries(CATEGORIAS).map(([key, val]) => ({
            name: val.label,
            value: `${conteos[key] || '?'} comandos`,
            inline: true,
          }))
        )
        .addFields({ name: '🔑 Slash Commands', value: '/genkey · /revokekey · /checkkey · /ticket · /verificar', inline: false })
        .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select-categoria')
          .setPlaceholder('📂 Selecciona una categoría...')
          .addOptions(
            Object.entries(CATEGORIAS).map(([value, { label, desc, emoji }]) => ({ label, description: desc, value, emoji }))
          )
      );

      message.reply({ embeds: [embed], components: [menu] });
    },
  };