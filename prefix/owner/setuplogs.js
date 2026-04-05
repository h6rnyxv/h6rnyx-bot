import { ChannelType, EmbedBuilder, PermissionsBitField } from 'discord.js';
  import { setLogKeyChannel, setLogTicketChannel } from '../../utils/settings.js';

  export default {
    nombre: 'setuplogs',
    descripcion: 'Crea la categoría de logs y configura los canales automáticamente',
    categoria: 'owner',

    async ejecutar({ client, message, args }) {
      if (!message.guild) return;

      const botMember = message.guild.members.me;
      if (!botMember.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return message.reply('❌ Necesito el permiso **Gestionar Canales**.');

      const msg = await message.reply('⏳ Creando canales de logs...');

      try {
        // Categoría
        const categoria = await message.guild.channels.create({
          name: '📋 logs',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            { id: message.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: botMember.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          ],
        });

        // Canal key-logs
        const keyLog = await message.guild.channels.create({
          name: 'key-logs',
          type: ChannelType.GuildText,
          parent: categoria.id,
          permissionOverwrites: [
            { id: message.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: botMember.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          ],
        });

        // Canal ticket-logs
        const ticketLog = await message.guild.channels.create({
          name: 'ticket-logs',
          type: ChannelType.GuildText,
          parent: categoria.id,
          permissionOverwrites: [
            { id: message.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: botMember.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          ],
        });

        // Guardar en settings
        setLogKeyChannel(message.guild.id, keyLog.id);
        setLogTicketChannel(message.guild.id, ticketLog.id);

        const embed = new EmbedBuilder()
          .setTitle('✅ Logs configurados')
          .setColor(0x57f287)
          .setDescription('Se crearon los canales de log y se asignaron automáticamente.')
          .addFields(
            { name: '🔑 Key Logs',    value: `<#${keyLog.id}>`,    inline: true },
            { name: '🎫 Ticket Logs', value: `<#${ticketLog.id}>`, inline: true },
          )
          .setFooter({ text: `Categoría: ${categoria.name}` })
          .setTimestamp();

        await msg.edit({ content: '', embeds: [embed] });
      } catch (e) {
        console.error('[SETUPLOGS]', e);
        await msg.edit('❌ Error al crear los canales: ' + e.message);
      }
    },
  };
  