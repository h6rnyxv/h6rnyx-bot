import { EmbedBuilder } from 'discord.js';

  const KEYSERVER = 'https://h6rnyx-keyserver.vercel.app/api/generatekey';

  export default {
    nombre: 'genkey',
    descripcion: 'Genera una API key (lifetime o con tiempo limitado).',
    uso: '.genkey <lifetime|2h|24h|7d>',
    owner: true,

    async ejecutar({ message, args }) {
      const tipo = args[0]?.toLowerCase() || 'lifetime';
      const validos = ['lifetime', '1h', '2h', '6h', '12h', '24h', '1d', '7d', '30d'];

      if (!validos.includes(tipo)) {
        return message.reply(
          `❌ Tipo inválido. Usa: \`lifetime\`, \`2h\`, \`24h\`, \`7d\`, etc.`
        );
      }

      const adminKey = process.env.ADMIN_KEY;
      if (!adminKey) {
        return message.reply('❌ `ADMIN_KEY` no configurada en el bot.');
      }

      const loadMsg = await message.channel.send('⏳ Generando key...');

      try {
        const res = await fetch(KEYSERVER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            admin_key: adminKey,
            expires_in: tipo,
            label: `Bot | ${message.author.tag} | ${tipo}`,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.key) {
          await loadMsg.delete().catch(() => {});
          return message.reply(`❌ Error: ${data.error || 'No se pudo generar la key.'}`);
        }

        const embed = new EmbedBuilder()
          .setTitle('🔑 Key Generada')
          .setColor('DarkRed')
          .addFields(
            { name: 'Key', value: `\`${data.key}\``, inline: false },
            { name: 'Tipo', value: tipo === 'lifetime' ? '♾️ Lifetime' : `⏱️ ${tipo}`, inline: true },
            {
              name: 'Expira',
              value: data.expires_at === 'never' ? 'Nunca' : `<t:${Math.floor(new Date(data.expires_at).getTime() / 1000)}:R>`,
              inline: true,
            },
          )
          .setFooter({ text: `Generada por ${message.author.tag}` })
          .setTimestamp();

        await loadMsg.delete().catch(() => {});
        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
      } catch (err) {
        await loadMsg.delete().catch(() => {});
        message.reply('❌ Error de conexión con el keyserver.');
      }
    },
  };
  