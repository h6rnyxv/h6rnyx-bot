import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
  import { sendKeyLog } from '../utils/keyLogger.js';

  const KEYSERVER = 'https://h6rnyx-keyserver.vercel.app/api/generatekey';

  export default {
    data: new SlashCommandBuilder()
      .setName('genkey')
      .setDescription('[Admin] Genera una nueva key')
      .addStringOption(opt =>
        opt.setName('duracion').setDescription('Duración de la key').setRequired(false)
          .addChoices(
            { name: '2 horas', value: '2h' }, { name: '6 horas', value: '6h' },
            { name: '12 horas', value: '12h' }, { name: '24 horas', value: '24h' },
            { name: '7 días', value: '7d' }, { name: '30 días', value: '30d' },
            { name: 'Lifetime (sin expiración)', value: 'lifetime' },
          )
      )
      .addStringOption(opt =>
        opt.setName('etiqueta').setDescription('Etiqueta para identificar la key (opcional)').setRequired(false)
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
      if (!adminKey)
        return interaction.reply({ content: '❌ `ADMIN_KEY` no configurada.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      const tipo     = interaction.options.getString('duracion') || '2h';
      const etiqueta = interaction.options.getString('etiqueta') || `Bot | ${interaction.user.tag} | ${tipo}`;

      try {
        const res = await fetch(KEYSERVER, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_key: adminKey, expires_in: tipo, label: etiqueta }),
        });
        const data = await res.json();
        if (!res.ok || !data.key)
          return interaction.editReply({ content: `❌ Error: ${data.error || 'No se pudo generar.'}` });

        const expiresValue = data.expires_at === 'never'
          ? '♾️ Nunca (lifetime)'
          : `<t:${Math.floor(new Date(data.expires_at).getTime() / 1000)}:R>`;

        const embed = new EmbedBuilder()
          .setTitle('🔑 Key Generada').setColor(0x57f287)
          .addFields(
            { name: 'Key',      value: `\`${data.key}\``, inline: false },
            { name: 'Duración', value: tipo === 'lifetime' ? '♾️ Lifetime' : `⏱️ ${tipo}`, inline: true },
            { name: 'Expira',   value: expiresValue, inline: true },
            { name: 'Etiqueta', value: etiqueta, inline: false },
          )
          .setFooter({ text: `Generada por ${interaction.user.tag}` }).setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        await sendKeyLog(interaction.client, interaction.guildId, {
          accion: 'genkey',
          ejecutadoPor: `${interaction.user.tag} (<@${interaction.user.id}>)`,
          key: data.key,
          tipo: tipo === 'lifetime' ? '♾️ Lifetime' : `⏱️ ${tipo}`,
          expira: expiresValue,
          extra: `Etiqueta: ${etiqueta}`,
        });
      } catch (err) {
        console.error('[GENKEY]', err);
        await interaction.editReply({ content: '❌ Error de conexión con el keyserver.' });
      }
    },
  };
  