import {
    PermissionsBitField, EmbedBuilder, ActionRowBuilder,
    ButtonBuilder, ButtonStyle, ChannelType,
    ModalBuilder, TextInputBuilder, TextInputStyle,
  } from 'discord.js';
  import { getNextTicketNumber } from '../utils/settings.js';
  import { sendTicketOpenLog, sendTicketCloseLog } from '../utils/ticketLogger.js';

  const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID;
  const OWNER_ID      = process.env.DISCORD_OWNER_ID;

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
      }

      if (interaction.isModalSubmit() && interaction.customId === 'modal_cerrar_ticket') {
        await handleModalCierre(interaction, client);
        return;
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
        topic: `Ticket #${numero} | Usuario: ${user.tag} | ID: ${user.id} | Idioma: ${idioma}`,
      });
    } catch (err) {
      console.error('[TICKET] Error al crear canal:', err);
      return interaction.editReply({
        content: idioma === 'en'
          ? '❌ Could not create the ticket. Check my permissions.'
          : '❌ No pude crear el ticket. Verifica mis permisos.',
      });
    }

    const embedPrincipal = new EmbedBuilder()
      .setTitle(idioma === 'en' ? `🎫 Ticket #${numero} — h6rnyx Support` : `🎫 Ticket #${numero} — h6rnyx Soporte`)
      .setDescription(idioma === 'en'
        ? 'A staff member will assist you shortly.\nUse the button below to close the ticket when resolved.'
        : 'Un staff te atenderá pronto.\nUsa el botón de abajo para cerrar el ticket cuando se resuelva.')
      .setColor(0x5865f2)
      .setFooter({ text: `h6rnyx ${idioma === 'en' ? 'Support' : 'Soporte'} • Ticket #${numero}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cerrar_ticket')
        .setLabel(idioma === 'en' ? '🔒 Close Ticket' : '🔒 Cerrar Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await canal.send({
      content: `${user}${ADMIN_ROLE_ID ? ` <@&${ADMIN_ROLE_ID}>` : ''}`,
      embeds: [embedPrincipal], components: [row],
    });

    // Mensaje de bienvenida con instrucciones en el idioma del ticket
    const bienvenida = idioma === 'en'
      ? `👋 Hello ${user}! Thank you for opening a ticket.\n\nPlease provide us with the following so we can help you as quickly as possible:\n\n• **What is your issue?** Describe it in detail.\n• **When did it happen?** (date/time if possible)\n• **Screenshots or evidence** (if applicable)\n\nA staff member will be with you shortly. 🙏`
      : `👋 ¡Hola ${user}! Gracias por abrir un ticket.\n\nPor favor bríndanos la siguiente información para poder ayudarte lo más rápido posible:\n\n• **¿Cuál es tu problema?** Descríbelo con detalle.\n• **¿Cuándo ocurrió?** (fecha/hora si es posible)\n• **Capturas o evidencias** (si aplica)\n\nUn miembro del staff te atenderá en breve. 🙏`;

    await canal.send({ content: bienvenida });

    await interaction.editReply({
      content: idioma === 'en'
        ? `✅ Your ticket was created: ${canal}`
        : `✅ Tu ticket fue creado: ${canal}`,
    });

    await sendTicketOpenLog(client, guild.id, { usuario: user, canal: `${canal}`, numero, idioma });
  }

  async function handleCerrarTicket(interaction) {
    if (!interaction.channel.name.startsWith('ticket-'))
      return interaction.reply({ content: '❌ Este no es un canal de ticket.', ephemeral: true });

    const topic         = interaction.channel.topic || '';
    const userMatch     = topic.match(/ID: (\d+)/);
    const ticketOwnerId = userMatch?.[1];
    const isOwner       = interaction.user.id === OWNER_ID;
    const isAdmin       = ADMIN_ROLE_ID ? interaction.member?.roles?.cache?.has(ADMIN_ROLE_ID) : false;
    const isTicketOwner = interaction.user.id === ticketOwnerId;

    if (!isOwner && !isAdmin && !isTicketOwner)
      return interaction.reply({ content: '❌ No tienes permiso para cerrar este ticket.', ephemeral: true });

    const idioma = topic.includes('Idioma: en') ? 'en' : 'es';

    const modal = new ModalBuilder()
      .setCustomId('modal_cerrar_ticket')
      .setTitle(idioma === 'en' ? '🔒 Close Ticket' : '🔒 Cerrar Ticket');

    const razonInput = new TextInputBuilder()
      .setCustomId('razon_cierre')
      .setLabel(idioma === 'en' ? 'Reason for closing' : 'Razón de cierre')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500)
      .setPlaceholder(idioma === 'en'
        ? 'Describe why you are closing this ticket...'
        : 'Describe por qué estás cerrando este ticket...');

    modal.addComponents(new ActionRowBuilder().addComponents(razonInput));
    await interaction.showModal(modal);
  }

  async function handleModalCierre(interaction, client) {
    const razon  = interaction.fields.getTextInputValue('razon_cierre');
    const canal  = interaction.channel;
    const topic  = canal.topic || '';
    const idioma = topic.includes('Idioma: en') ? 'en' : 'es';
    const numero = canal.name.replace('ticket-', '');
    const userMatch = topic.match(/ID: (\d+)/);
    const userId = userMatch?.[1];

    await interaction.reply({
      content: idioma === 'en'
        ? `🔒 Closing ticket... Reason: **${razon}**`
        : `🔒 Cerrando ticket... Razón: **${razon}**`,
    });

    // Compilar transcript
    let transcript = '';
    try {
      let mensajes = [];
      let antes = null;
      while (true) {
        const opts = { limit: 100 };
        if (antes) opts.before = antes;
        const lote = await canal.messages.fetch(opts);
        if (lote.size === 0) break;
        mensajes = mensajes.concat([...lote.values()]);
        antes = lote.last().id;
        if (lote.size < 100) break;
      }
      mensajes.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      transcript  = `Transcript — Ticket #${numero}\n`;
      transcript += `Cerrado por: ${interaction.user.tag} | Razón: ${razon}\n`;
      transcript += '='.repeat(60) + '\n\n';
      for (const m of mensajes) {
        const fecha = new Date(m.createdTimestamp).toISOString().replace('T', ' ').slice(0, 19);
        const adjuntos = m.attachments.size > 0 ? ' [' + m.attachments.map(a => a.url).join(', ') + ']' : '';
        if (m.content || adjuntos) transcript += `[${fecha}] ${m.author.tag}: ${m.content}${adjuntos}\n`;
      }
    } catch (e) {
      console.error('[TICKET] Error al compilar transcript:', e);
      transcript = 'Error al obtener el transcript.';
    }

    const usuario = userId
      ? await client.users.fetch(userId).catch(() => `<@${userId}>`)
      : 'Desconocido';

    await sendTicketCloseLog(client, interaction.guild.id, {
      usuario, cerradoPor: interaction.user,
      canal: `#${canal.name}`, numero, idioma, razon, transcript,
    });

    setTimeout(() => canal.delete().catch(() => {}), 5000);
  }
  