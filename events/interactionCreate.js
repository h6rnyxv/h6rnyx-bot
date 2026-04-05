import {
    PermissionsBitField, EmbedBuilder, ActionRowBuilder,
    ButtonBuilder, ButtonStyle, ChannelType,
  } from 'discord.js';
  import { getNextTicketNumber } from '../utils/settings.js';
  import { sendTicketLog } from '../utils/ticketLogger.js';

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
        if (interaction.customId === 'crear_ticket_es') { await handleCrearTicket(interaction, client, 'es'); return; }
        if (interaction.customId === 'crear_ticket_en') { await handleCrearTicket(interaction, client, 'en'); return; }
        if (interaction.customId === 'cerrar_ticket')   { await handleCerrarTicket(interaction); return; }
        if (interaction.customId === 'confirmar_cerrar_ticket') { await handleConfirmarCerrar(interaction, client); return; }
      }
    },
  };

  async function handleHelpMenu(interaction, client) {
    const p = client.prefix;
    const valor = interaction.values[0];
    const categorias = {
      diversion: {
        titulo: '🎉 Diversión', color: 0xff69b4,
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
        titulo: '🛡️ Moderación', color: 0x5865f2,
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
        titulo: '🛠️ General', color: 0x57f287,
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
    const embed = new EmbedBuilder().setTitle(cat.titulo).setColor(cat.color)
      .setDescription(cat.comandos.join('\n')).setFooter({ text: `Prefix: ${p}` });
    await interaction.update({ embeds: [embed] });
  }

  async function handleCrearTicket(interaction, client, idioma) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;
    const user  = interaction.user;

    // Buscar si ya tiene un ticket abierto
    const ticketExistente = guild.channels.cache.find(
      c => c.topic?.includes(`ID: ${user.id}`) && c.name.startsWith('ticket-')
    );
    if (ticketExistente) {
      return interaction.editReply({
        content: idioma === 'en'
          ? `❌ You already have an open ticket: ${ticketExistente}`
          : `❌ Ya tienes un ticket abierto: ${ticketExistente}`,
      });
    }

    const numero     = getNextTicketNumber(guild.id);
    const ticketName = `ticket-${numero}`;

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
          PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageMessages,
        ],
      });
    }

    let canal;
    try {
      canal = await guild.channels.create({
        name: ticketName, type: ChannelType.GuildText,
        permissionOverwrites: permisos,
        topic: `Ticket #${numero} de ${user.tag} | ID: ${user.id} | Idioma: ${idioma}`,
      });
    } catch (err) {
      console.error('[TICKET] Error al crear canal:', err);
      return interaction.editReply({
        content: idioma === 'en'
          ? '❌ Could not create the ticket. Check my permissions.'
          : '❌ No pude crear el ticket. Verifica mis permisos.',
      });
    }

    const embed = idioma === 'en'
      ? new EmbedBuilder()
          .setTitle(`🎫 Ticket #${numero} — h6rnyx Support`)
          .setDescription(`Hello ${user}! A staff member will assist you shortly.\n\nPlease describe your issue or question here.`)
          .setColor(0x5865f2)
          .setFooter({ text: `h6rnyx Support • Ticket #${numero}` }).setTimestamp()
      : new EmbedBuilder()
          .setTitle(`🎫 Ticket #${numero} — h6rnyx Soporte`)
          .setDescription(`Hola ${user}! Un staff te atenderá pronto.\n\nDescribe tu problema o pregunta aquí.`)
          .setColor(0x5865f2)
          .setFooter({ text: `h6rnyx Support • Ticket #${numero}` }).setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('cerrar_ticket')
        .setLabel(idioma === 'en' ? '🔒 Close Ticket' : '🔒 Cerrar Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await canal.send({
      content: `${user}${ADMIN_ROLE_ID ? ` <@&${ADMIN_ROLE_ID}>` : ''}`,
      embeds: [embed], components: [row],
    });

    await interaction.editReply({
      content: idioma === 'en'
        ? `✅ Your ticket was created: ${canal}`
        : `✅ Tu ticket fue creado: ${canal}`,
    });

    // Log del ticket
    await sendTicketLog(client, guild.id, {
      accion: 'abierto', usuario: user, canal: `${canal}`, numero, idioma,
    });
  }

  async function handleCerrarTicket(interaction) {
    if (!interaction.channel.name.startsWith('ticket-'))
      return interaction.reply({ content: '❌ Este no es un canal de ticket. / This is not a ticket channel.', ephemeral: true });

    const idioma = interaction.channel.topic?.includes('Idioma: en') ? 'en' : 'es';

    const embed = new EmbedBuilder()
      .setTitle(idioma === 'en' ? '🔒 Close Ticket' : '🔒 Cerrar Ticket')
      .setDescription(idioma === 'en'
        ? 'Are you sure you want to close and delete this ticket?'
        : '¿Estás seguro de que quieres cerrar y eliminar este ticket?')
      .setColor(0xed4245);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('confirmar_cerrar_ticket')
        .setLabel(idioma === 'en' ? '✅ Yes, close' : '✅ Sí, cerrar').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('cancelar')
        .setLabel(idioma === 'en' ? '❌ Cancel' : '❌ Cancelar').setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  async function handleConfirmarCerrar(interaction, client) {
    const topic   = interaction.channel.topic || '';
    const numero  = interaction.channel.name.replace('ticket-', '');
    const idioma  = topic.includes('Idioma: en') ? 'en' : 'es';
    const userMatch = topic.match(/ID: (\d+)/);
    const userId  = userMatch?.[1];

    await interaction.reply({
      content: idioma === 'en' ? '🗑️ Closing ticket in 5 seconds...' : '🗑️ Cerrando ticket en 5 segundos...',
    });

    if (userId && client) {
      const user = await client.users.fetch(userId).catch(() => null);
      await sendTicketLog(client, interaction.guild.id, {
        accion: 'cerrado',
        usuario: user || `<@${userId}>`,
        canal: `#${interaction.channel.name}`,
        numero, idioma,
      });
    }

    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
  