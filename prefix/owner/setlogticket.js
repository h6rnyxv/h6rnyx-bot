import { EmbedBuilder } from 'discord.js';
  import { setLogTicketChannel, getLogTicketChannel } from '../../utils/settings.js';

  export default {
    nombre: 'setlogticket',
    descripcion: 'Configura el canal de logs de tickets.',
    uso: '!setlogticket #canal | !setlogticket off',
    owner: true,

    async ejecutar({ client, message, args }) {
      const guildId = message.guild.id;
      if (args[0]?.toLowerCase() === 'off') {
        if (!getLogTicketChannel(guildId)) return message.reply('ℹ️ El log de tickets ya estaba desactivado.');
        setLogTicketChannel(guildId, null);
        return message.reply('✅ Log de tickets **desactivado**.');
      }
      const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      if (!canal) return message.reply(`❌ Menciona un canal. Uso: \`!setlogticket #canal\` o \`!setlogticket off\``);
      if (!canal.permissionsFor(message.guild.members.me)?.has('SendMessages'))
        return message.reply(`❌ No tengo permisos para enviar mensajes en ${canal}.`);

      setLogTicketChannel(guildId, canal.id);
      const embed = new EmbedBuilder()
        .setTitle('🎫 Log de Tickets Configurado').setColor(0x5865f2)
        .setDescription(`Los logs de tickets se enviarán a ${canal}.`)
        .setFooter({ text: `Por ${message.author.tag}` }).setTimestamp();
      message.reply({ embeds: [embed] });
      canal.send({ embeds: [new EmbedBuilder().setTitle('✅ Canal de logs de tickets configurado').setColor(0x5865f2)
        .setDescription('Aquí aparecerán los logs de apertura y cierre de tickets.').setTimestamp()] }).catch(() => {});
    },
  };
  