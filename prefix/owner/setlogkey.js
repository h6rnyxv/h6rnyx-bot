import { EmbedBuilder } from 'discord.js';
  import { setLogKeyChannel, getLogKeyChannel } from '../../utils/settings.js';

  export default {
    nombre: 'setlogkey',
    descripcion: 'Configura el canal donde se registran los logs de keys.',
    uso: '!setlogkey #canal  |  !setlogkey off',
    owner: true,

    async ejecutar({ client, message, args }) {
      const guildId = message.guild.id;
      const prefix = client.prefix;

      // Desactivar logging
      if (args[0]?.toLowerCase() === 'off') {
        const anterior = getLogKeyChannel(guildId);
        if (!anterior) return message.reply('ℹ️ El log de keys ya estaba desactivado.');
        setLogKeyChannel(guildId, null);
        return message.reply('✅ Log de keys **desactivado**.');
      }

      // Verificar canal mencionado
      const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

      if (!canal) {
        return message.reply(
          `❌ Debes mencionar un canal válido.\n` +
          `Uso: \`${prefix}setlogkey #canal\` o \`${prefix}setlogkey off\` para desactivar.`
        );
      }

      // Verificar que el bot pueda enviar mensajes ahí
      if (!canal.permissionsFor(message.guild.members.me)?.has('SendMessages')) {
        return message.reply(`❌ No tengo permisos para enviar mensajes en ${canal}.`);
      }

      setLogKeyChannel(guildId, canal.id);

      const embed = new EmbedBuilder()
        .setTitle('📋 Log de Keys Configurado')
        .setColor(0x57f287)
        .setDescription(`Los logs de generación, verificación y revocación de keys se enviarán a ${canal}.`)
        .addFields({ name: 'Canal', value: `${canal}`, inline: true })
        .setFooter({ text: `Configurado por ${message.author.tag}` })
        .setTimestamp();

      message.reply({ embeds: [embed] });

      // Enviar mensaje de prueba al canal configurado
      canal.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('✅ Canal de logs configurado')
            .setColor(0x57f287)
            .setDescription('Aquí aparecerán los logs de keys (genkey, checkkey, revokekey).')
            .setTimestamp(),
        ],
      }).catch(() => {});
    },
  };
  