import { EmbedBuilder } from 'discord.js';
  import { setLogKeyChannel, getLogKeyChannel } from '../../utils/settings.js';

  export default {
    nombre: 'setlogkey',
    descripcion: 'Configura el canal de logs de keys.',
    uso: '!setlogkey #canal | !setlogkey off',
    owner: true,

    async ejecutar({ client, message, args }) {
      const guildId = message.guild.id;
      if (args[0]?.toLowerCase() === 'off') {
        if (!getLogKeyChannel(guildId)) return message.reply('ℹ️ El log de keys ya estaba desactivado.');
        setLogKeyChannel(guildId, null);
        return message.reply('✅ Log de keys **desactivado**.');
      }
      const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      if (!canal) return message.reply(`❌ Menciona un canal. Uso: \`!setlogkey #canal\` o \`!setlogkey off\``);
      if (!canal.permissionsFor(message.guild.members.me)?.has('SendMessages'))
        return message.reply(`❌ No tengo permisos para enviar mensajes en ${canal}.`);

      setLogKeyChannel(guildId, canal.id);
      const embed = new EmbedBuilder()
        .setTitle('🔑 Log de Keys Configurado').setColor(0x57f287)
        .setDescription(`Los logs de keys se enviarán a ${canal}.`)
        .setFooter({ text: `Por ${message.author.tag}` }).setTimestamp();
      message.reply({ embeds: [embed] });
      canal.send({ embeds: [new EmbedBuilder().setTitle('✅ Canal de logs de keys configurado').setColor(0x57f287)
        .setDescription('Aquí aparecerán los logs de genkey, checkkey y revokekey.').setTimestamp()] }).catch(() => {});
    },
  };
  