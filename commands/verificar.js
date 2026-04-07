import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const KEYSERVER_URL = process.env.KEYSERVER_URL || 'https://h6rnyx-keyserver.vercel.app';
const BOT_SECRET    = process.env.BOT_SECRET || '';

export default {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Verifica que estás en el servidor para obtener tu key / Verify your membership to get your key'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.member;
    if (!member) {
      return interaction.editReply({ content: '❌ No se pudo verificar tu membresía. Usa este comando dentro del servidor.' });
    }

    // Generar token en el keyserver
    let token;
    try {
      const res = await fetch(`${KEYSERVER_URL}/api/bot/create-verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bot-secret': BOT_SECRET,
        },
        body: JSON.stringify({ discord_user_id: interaction.user.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        console.error('[VERIFICAR] Error al crear token:', data);
        return interaction.editReply({ content: '❌ Error al generar el link. Intenta de nuevo más tarde.' });
      }

      token = data.token;
    } catch (err) {
      console.error('[VERIFICAR] Error de red:', err);
      return interaction.editReply({ content: '❌ No se pudo conectar con el servidor. Intenta más tarde.' });
    }

    const verifyLink = `${KEYSERVER_URL}/api/discord/verify?vt=${token}`;

    // Intentar mandar DM
    const embed = new EmbedBuilder()
      .setTitle('🔑 Verificación de Membresía')
      .setColor(0x5865F2)
      .setDescription(
        '🇺🇸 **Click the link below to verify your Discord membership.**\n' +
        'After verifying, you will be able to complete the steps to get your key.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '🇪🇸 **Haz clic en el link de abajo para verificar tu membresía en Discord.**\n' +
        'Después de verificar, podrás completar los pasos para obtener tu key.\n\n' +
        `🔗 **Link:** ${verifyLink}\n\n` +
        '-# Este link expira en 10 minutos  •  This link expires in 10 minutes'
      )
      .setFooter({ text: 'h6rnyxv hub' })
      .setTimestamp();

    try {
      await interaction.user.send({ embeds: [embed] });
      await interaction.editReply({
        content: '✅ Te mandé el link de verificación por DM. ¡Revisa tus mensajes directos!\n-# I sent you the verification link via DM. Check your direct messages!',
      });
    } catch {
      // Si no puede mandar DM, mostrar el link en el canal ephemeral
      await interaction.editReply({
        embeds: [embed],
        content: '-# No se pudo mandar DM. Aquí está tu link (solo tú puedes verlo):',
      });
    }
  },
};
