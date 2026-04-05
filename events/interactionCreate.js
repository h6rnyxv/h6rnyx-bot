import {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from 'discord.js';

const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID;

export default {
  name: 'interactionCreate',
  once: false,

  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const comando = client.commands.get(interaction.commandName);
      if (!comando) return;
      try {
        await comando.execute(interaction, client);
      } catch (err) {
        console.error(`[ERROR] /${interaction.commandName}:`, err);
        const msg = { content: '❌ Error al ejecutar el comando.', ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
        else await interaction.reply(msg).catch(() => {});
      }
      return;
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'select-categoria') {
      await handleHelpMenu(interaction, client);
      return;
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'crear_ticket') { await handleCrearTicket(interaction); return; }
      if (interaction.customId === 'cerrar_ticket') { await handleCerrarTicket(interaction); return; }
      if (interaction.customId === 'confirmar_cerrar_ticket') { await handleConfirmarCerrar(interaction); return; }
    }
  },
};

async function handleHelpMenu(interaction, client) {
  const p = client.prefix;
  const valor = interaction.values[0];

  const categorias = {
    diversion: {
      titulo: '🎉 Diversión',
      color: 0xff69b4,
      comandos: [
        `\`${p}8ball <pregunta>\` — La bola mágica responde.`,
        `\`${p}abrazo @usuario\` — Abrazas a alguien.`,
        `\`${p}beso @usuario\` — Besas a alguien.`,
        `\`${p}chiste\` — Chiste aleatorio.`,
        `\`${p}dado [caras]\` — Lanza un dado.`,
        `\`${p}howgay [@usuario]\` — ¿Qué tan gay eres? (broma).`,
        `\`${p}meme\` — Meme aleatorio.`,
        `\`${p}piropo [@usuario]\` — Lanza un piropo.`,
        `\`${p}say <texto>\` — El bot repite lo que escribas.`,
        `\`${p}ship @user1 @user2\` — Compatibilidad entre dos personas.`,
        `\`${p}teamo\` — El bot te responde con cariño.`,
      ],
    },
    moderacion: {
      titulo: '🛡️ Moderación',
      color: 0x5865f2,
      comandos: [
        `\`${p}ban @usuario [razón]\` — Banea a un usuario.`,
        `\`${p}kick @usuario [razón]\` — Expulsa a un usuario.`,
        `\`${p}mute @usuario [minutos]\` — Silencia a un usuario.`,
        `\`${p}unmute @usuario\` — Desmutea a un usuario.`,
        `\`${p}warn @usuario [razón]\` — Advierte a un usuario.`,
        `\`${p}clear <cantidad>\` — Borra mensajes (1–100).`,
        `\`${p}lock\` — Bloquea el canal.`,
        `\`${p}unlock\` — Desbloquea el canal.`,
        `\`${p}slowmode <segundos>\` — Slowmode (0 = desactivar).`,
        `\`${p}nuke\` — Reinicia el canal clonándolo.`,
      ],
    },
    general: {
      titulo: '🛠️ General',
      color: 0x57f287,
      comandos: [
        `\`${p}ping\` — Latencia del bot.`,
        `\`${p}help\` — Muestra este menú.`,
        `\`${p}avatar [@usuario]\` — Avatar de un usuario.`,
        `\`${p}userinfo [@usuario]\` — Info de un usuario.`,
        `\`${p}serverinfo\` — Info del servidor.`,
      ],
    },
  };

  const cat = categorias[valor];
  if (!cat) return;

  const embed = new EmbedBuilder()
    .setTitle(cat.titulo)
    .setColor(cat.color)
    .setDescription(cat.comandos.join('\n'))
    .setFooter({ text: `Prefix: ${p}` });

  await interaction.update({ embeds: [embed] });
}

async function handleCrearTicket(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const guild = interaction.guild;
  const user = interaction.user;
  const ticketName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const existe = guild.channels.cache.find(c => c.name === ticketName);
  if (existe) return interaction.editReply({ content: `❌ Ya tienes un ticket abierto: ${existe}` });

  const permisos = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    {
      id: user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    },
  ];

  if (ADMIN_ROLE_ID) {
    permisos.push({
      id: ADMIN_ROLE_ID,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageMessages,
      ],
    });
  }

  let canal;
  try {
    canal = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      permissionOverwrites: permisos,
      topic: `Ticket de ${user.tag} | ID: ${user.id}`,
    });
  } catch (err) {
    console.error('[TICKET] Error al crear canal:', err);
    return interaction.editReply({ content: '❌ No pude crear el ticket. Verifica mis permisos.' });
  }

  const embed = new EmbedBuilder()
    .setTitle('🎫 Ticket Abierto')
    .setDescription(`Hola ${user}! Un staff te atenderá pronto.\n\nDescribe tu problema o pregunta aquí.`)
    .setColor(0x5865f2)
    .setFooter({ text: `h6rnyx Support • ${new Date().toLocaleDateString('es-ES')}` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('cerrar_ticket').setLabel('🔒 Cerrar Ticket').setStyle(ButtonStyle.Danger)
  );

  await canal.send({ content: `${user}${ADMIN_ROLE_ID ? ` <@&${ADMIN_ROLE_ID}>` : ''}`, embeds: [embed], components: [row] });
  await interaction.editReply({ content: `✅ Tu ticket fue creado: ${canal}` });
}

async function handleCerrarTicket(interaction) {
  if (!interaction.channel.name.startsWith('ticket-'))
    return interaction.reply({ content: '❌ Este no es un canal de ticket.', ephemeral: true });

  const embed = new EmbedBuilder()
    .setTitle('🔒 Cerrar Ticket')
    .setDescription('¿Estás seguro de que quieres cerrar y eliminar este ticket?')
    .setColor(0xed4245);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('confirmar_cerrar_ticket').setLabel('✅ Sí, cerrar').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('cancelar').setLabel('❌ Cancelar').setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleConfirmarCerrar(interaction) {
  await interaction.reply({ content: '🗑️ Cerrando ticket en 5 segundos...' });
  setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
}
