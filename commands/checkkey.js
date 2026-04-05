import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const KEYSERVER = 'https://h6rnyx-keyserver.vercel.app/api/keystatus';

export default {
  data: new SlashCommandBuilder()
    .setName('checkkey')
    .setDescription('[Admin] Verifica el estado de una key')
    .addStringOption(opt =>
      opt.setName('key')
        .setDescription('La key a verificar')
        .setRequired(true)
    ),

  async execute(interaction) {
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
    const ownerId = process.env.DISCORD_OWNER_ID;
    const isOwner = interaction.user.id === ownerId;
    const isAdmin = adminRoleId
      ? interaction.member?.roles?.cache?.has(adminRoleId)
      : interaction.member?.permissions?.has(8n);

    if (!isOwner && !isAdmin) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    const key = interaction.options.getString('key');

    try {
      const res = await fetch(`${KEYSERVER}?key=${encodeURIComponent(key)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('❌ Key no encontrada')
              .setDescription(`La key \`${key}\` no existe o es inválida.`)
              .setColor(0xed4245),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🔑 Estado de Key')
        .setColor(data.expired ? 0xed4245 : 0x57f287)
        .addFields(
          { name: 'Key', value: `\`${data.key || key}\``, inline: false },
          { name: 'Estado', value: data.expired ? '❌ Expirada' : '✅ Válida', inline: true },
          {
            name: 'Expira',
            value: !data.expires_at ? '♾️ Nunca' : `<t:${Math.floor(new Date(data.expires_at).getTime() / 1000)}:R>`,
            inline: true,
          },
        )
        .setTimestamp();

      if (data.roblox_username) embed.addFields({ name: 'Usuario Roblox', value: data.roblox_username, inline: true });
      if (data.label) embed.addFields({ name: 'Etiqueta', value: data.label, inline: true });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[CHECKKEY]', err);
      await interaction.editReply({ content: '❌ Error de conexión con el keyserver.' });
    }
  },
};
