import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
  import { sendKeyLog } from '../utils/keyLogger.js';

  const KEYSERVER = 'https://h6rnyx-keyserver.vercel.app/api/revokekey';

  export default {
    data: new SlashCommandBuilder()
      .setName('revokekey').setDescription('[Admin] Revoca una key existente')
      .addStringOption(opt =>
        opt.setName('key').setDescription('La key a revocar').setRequired(true)
      ),

    async execute(interaction) {
      const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
      const ownerId     = process.env.DISCORD_OWNER_ID;
      const isOwner = interaction.user.id === ownerId;
      const isAdmin = adminRoleId
        ? interaction.member?.roles?.cache?.has(adminRoleId)
        : interaction.member?.permissions?.has(PermissionsBitField.Flags.Administrator);

      if (!isOwner && !isAdmin)
        return interaction.reply({ content: '❌ No tienes permiso.', ephemeral: true });

      const adminKey = process.env.ADMIN_KEY;
      if (!adminKey) return interaction.reply({ content: '❌ `ADMIN_KEY` no configurada.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      const key = interaction.options.getString('key');

      try {
        const res = await fetch(KEYSERVER, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_key: adminKey, key }),
        });
        const data = await res.json();
        if (!res.ok || data.error)
          return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('❌ Error al revocar')
            .setDescription(data.error || 'No se pudo revocar.').setColor(0xed4245)] });

        const embed = new EmbedBuilder()
          .setTitle('🗑️ Key Revocada').setColor(0xfee75c)
          .setDescription(`La key \`${key}\` fue revocada exitosamente.`)
          .setFooter({ text: `Por ${interaction.user.tag}` }).setTimestamp();
        await interaction.editReply({ embeds: [embed] });

        await sendKeyLog(interaction.client, interaction.guildId, {
          accion: 'revokekey',
          ejecutadoPor: `${interaction.user.tag} (<@${interaction.user.id}>)`,
          key,
        });
      } catch (err) {
        console.error('[REVOKEKEY]', err);
        await interaction.editReply({ content: '❌ Error de conexión con el keyserver.' });
      }
    },
  };
  