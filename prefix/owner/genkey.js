import { EmbedBuilder } from 'discord.js';
  import { sendKeyLog } from '../../utils/keyLogger.js';

  const KEYSERVER = 'https://h6rnyx-keyserver.vercel.app/api/generatekey';

  export default {
    nombre: 'genkey',
    descripcion: 'Genera una API key.',
    uso: '!genkey <lifetime|2h|24h|7d>',
    owner: true,

    async ejecutar({ message, args }) {
      const tipo   = args[0]?.toLowerCase() || 'lifetime';
      const validos = ['lifetime','1h','2h','6h','12h','24h','1d','7d','30d'];
      if (!validos.includes(tipo)) return message.reply(`❌ Tipo inválido. Usa: \`lifetime\`, \`2h\`, \`24h\`, \`7d\`…`);

      const adminKey = process.env.ADMIN_KEY;
      if (!adminKey) return message.reply('❌ `ADMIN_KEY` no configurada.');

      const loadMsg = await message.channel.send('⏳ Generando key...');
      try {
        const res = await fetch(KEYSERVER, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_key: adminKey, expires_in: tipo, label: `Bot | ${message.author.tag} | ${tipo}` }),
        });
        const data = await res.json();
        await loadMsg.delete().catch(() => {});
        if (!res.ok || !data.key) return message.reply(`❌ Error: ${data.error || 'No se pudo generar.'}`);

        const expiresStr = data.expires_at === 'never'
          ? 'Nunca' : `<t:${Math.floor(new Date(data.expires_at).getTime() / 1000)}:R>`;

        const embed = new EmbedBuilder()
          .setTitle('🔑 Key Generada').setColor('DarkRed')
          .addFields(
            { name: 'Key',    value: `\`${data.key}\``, inline: false },
            { name: 'Tipo',   value: tipo === 'lifetime' ? '♾️ Lifetime' : `⏱️ ${tipo}`, inline: true },
            { name: 'Expira', value: expiresStr, inline: true },
          )
          .setFooter({ text: `Por ${message.author.tag}` }).setTimestamp();

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});

        const { client } = message;
        await sendKeyLog(client, message.guild?.id, {
          accion: 'genkey',
          ejecutadoPor: `${message.author.tag} (<@${message.author.id}>)`,
          key: data.key,
          tipo: tipo === 'lifetime' ? '♾️ Lifetime' : `⏱️ ${tipo}`,
          expira: expiresStr,
        });
      } catch (err) {
        await loadMsg.delete().catch(() => {});
        message.reply('❌ Error de conexión con el keyserver.');
      }
    },
  };
  