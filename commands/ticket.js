import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

  export default {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Envía el panel para crear un ticket de soporte'),

    async execute(interaction) {
      console.log('[TICKET] Ejecutando nuevo código v2 - DOS BOTONES');

      const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
      const ownerId     = process.env.DISCORD_OWNER_ID;
      const isOwner = interaction.user.id === ownerId;
      const isAdmin = adminRoleId
        ? interaction.member?.roles?.cache?.has(adminRoleId)
        : interaction.member?.permissions?.has(8n);

      if (!isOwner && !isAdmin)
        return interaction.reply({ content: '❌ Solo admins pueden enviar el panel de tickets.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle('🎫 Soporte — h6rnyx')
        .setDescription(
          '**🇪🇸 Español**\n' +
          '¿Necesitas ayuda? Abre un ticket y un miembro del staff te atenderá pronto.\n' +
          '• Problemas con tu key\n• Reportar bugs del script\n• Preguntas generales\n\n' +
          '**🇬🇧 English**\n' +
          'Need help? Open a ticket and a staff member will assist you soon.\n' +
          '• Issues with your key\n• Report script bugs\n• General questions\n\n' +
          '> Click a button below to open your private ticket.'
        )
        .setColor(0x5865f2)
        .setFooter({ text: 'h6rnyx Support System' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('crear_ticket_es').setLabel('📩 Crear Ticket 🇪🇸').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('crear_ticket_en').setLabel('📩 Create Ticket 🇬🇧').setStyle(ButtonStyle.Secondary),
      );

      await interaction.reply({ embeds: [embed], components: [row] });
    },
  };
  