import { ChannelType, EmbedBuilder, PermissionsBitField } from 'discord.js';
  import { setLogKeyChannel, setLogTicketOpenChannel, setLogTicketCloseChannel } from '../../utils/settings.js';

  export default {
    nombre: 'setuplogs',
    descripcion: 'Crea los canales de log y los configura automáticamente',
    categoria: 'owner',

    async ejecutar({ client, message, args }) {
      if (!message.guild) return;

      const botMember = message.guild.members.me;
      if (!botMember.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return message.reply('❌ Necesito el permiso **Gestionar Canales**.');

      const msg = await message.reply('⏳ Creando canales de logs...');

      try {
        const categoria = await message.guild.channels.create({
          name: '📋 logs',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            { id: message.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: botMember.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          ],
        });

        const crearCanal = (name) => message.guild.channels.create({
          name, type: ChannelType.GuildText, parent: categoria.id,
          permissionOverwrites: [
            { id: message.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: botMember.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          ],
        });

        const [keyLog, ticketAbierto, ticketCerrado] = await Promise.all([
          crearCanal('key-logs'),
          crearCanal('ticket-abiertos'),
          crearCanal('ticket-cerrados'),
        ]);

        setLogKeyChannel(message.guild.id, keyLog.id);
        setLogTicketOpenChannel(message.guild.id, ticketAbierto.id);
        setLogTicketCloseChannel(message.guild.id, ticketCerrado.id);

        const embed = new EmbedBuilder()
          .setTitle('✅ Logs configurados')
          .setColor(0x57f287)
          .setDescription('Canales creados y configurados automáticamente.')
          .addFields(
            { name: '🔑 Key Logs',         value: `<#${keyLog.id}>`,        inline: true },
            { name: '🎫 Tickets Abiertos', value: `<#${ticketAbierto.id}>`, inline: true },
            { name: '🔒 Tickets Cerrados', value: `<#${ticketCerrado.id}>`, inline: true },
          )
          .setFooter({ text: `Categoría: ${categoria.name}` })
          .setTimestamp();

        await msg.edit({ content: '', embeds: [embed] });
      } catch (e) {
        console.error('[SETUPLOGS]', e);
        await msg.edit('❌ Error: ' + e.message);
      }
    },
  };
  