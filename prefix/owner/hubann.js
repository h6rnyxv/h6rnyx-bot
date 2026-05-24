export default {
    nombre: 'hubann',
    descripcion: 'Publica un anuncio en el hub de Roblox (keyserver).',
    owner: true,

    async ejecutar({ client, message, args }) {
      const texto = args.join(' ').trim();
      if (!texto) {
        return message.reply('❌ Uso: `!hubann <mensaje>`');
      }

      const secret = process.env.ANNOUNCE_SECRET;
      if (!secret) {
        return message.reply('❌ La variable `ANNOUNCE_SECRET` no está configurada en Railway.');
      }

      await message.react('⏳').catch(() => {});

      let res, body;
      try {
        res = await fetch('https://h6rnyx-keyserver.vercel.app/api/announcement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`,
          },
          body: JSON.stringify({
            message: texto,
            author:  message.author.username,
          }),
        });
        body = await res.json().catch(() => ({}));
      } catch (err) {
        return message.reply(`❌ Error de red: ${err.message}`);
      }

      await message.reactions.removeAll().catch(() => {});

      if (res.ok && body.ok) {
        await message.react('✅').catch(() => {});
        return message.reply(
          `✅ Anuncio publicado en el hub Roblox:\n> **${texto}**`
        );
      } else {
        await message.react('❌').catch(() => {});
        return message.reply(
          `❌ Error del keyserver (${res.status}): ${body.error ?? 'desconocido'}`
        );
      }
    },
  };
  