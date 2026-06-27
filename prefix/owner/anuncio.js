import { EmbedBuilder } from 'discord.js';
  import { errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'anuncio',
    descripcion: 'Envía un anuncio embed a todos los servidores donde está el bot.',
    uso: '<mensaje>',
    owner: true,

    async ejecutar({ client, message, args }) {
      const texto = args.join(' ');
      if (!texto)
        return message.reply({ embeds: [errorEmbed('Debes escribir el mensaje del anuncio.', message.author)] });

      const anuncioEmbed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle('📢 Anuncio')
        .setDescription(texto)
        .setColor(COLORS.gold)
        .setTimestamp()
        .setFooter({ text: `Anuncio oficial de ${client.user.username}` });

      let enviados = 0;
      for (const guild of client.guilds.cache.values()) {
        try {
          const canal = guild.channels.cache.find(c => c.type === 0 && c.permissionsFor(guild.members.me)?.has('SendMessages'));
          if (canal) { await canal.send({ embeds: [anuncioEmbed] }); enviados++; }
        } catch {}
      }

      message.reply({ embeds: [new EmbedBuilder()
        .setDescription(`✅ Anuncio enviado a **${enviados}** servidor(es).`)
        .setColor(COLORS.success)
        .setTimestamp()
      ] });
    },
  };