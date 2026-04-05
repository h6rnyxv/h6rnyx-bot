import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre el panel para crear un ticket de soporte'),

  async execute(interaction) {
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
    const ownerId = process.env.DISCORD_OWNER_ID;

    const isOwner = interaction.user.id === ownerId;
    const isAdmin = adminRoleId
      ? interaction.member?.roles?.cache?.has(adminRoleId)
      : interaction.member?.permissions?.has(8n);

    if (!isOwner && !isAdmin) {
      return interaction.reply({ content: '❌ Solo admins pueden enviar el panel de tickets.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 Soporte — h6rnyx')
      .setDescription(
        '¿Necesitas ayuda? Abre un ticket y un miembro del staff te atenderá pronto.\n\n' +
        '**Puedes abrir un ticket para:**\n' +
        '• Problemas con tu key\n' +
        '• Reportar bugs del script\n' +
        '• Preguntas generales\n\n' +
        '> Haz clic en el botón para crear tu ticket privado.'
      )
      .setColor(0x5865f2)
      .setFooter({ text: 'h6rnyx Support System' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('crear_ticket')
        .setLabel('📩 Crear Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
