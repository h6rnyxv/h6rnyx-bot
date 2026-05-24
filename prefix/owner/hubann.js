export default {
    nombre: 'hubann',
    descripcion: 'Publica un anuncio en el hub de Roblox y verifica que se guardó.',
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

      // 1. POST del anuncio
      let postRes, postBody;
      try {
        postRes = await fetch(`${process.env.KEYSERVER_URL ?? 'https://h6rnyx-keyserver.vercel.app'}/api/announcement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`,
          },
          body: JSON.stringify({ message: texto, author: message.author.username }),
        });
        postBody = await postRes.json().catch(() => ({}));
      } catch (err) {
        await message.reactions.removeAll().catch(() => {});
        return message.reply(`❌ Error de red al enviar: ${err.message}`);
      }

      if (!postRes.ok || !postBody.ok) {
        await message.reactions.removeAll().catch(() => {});
        return message.reply(`❌ El keyserver rechazó el anuncio (${postRes.status}): ${postBody.error ?? 'desconocido'}`);
      }

      // 2. Verificar que se guardó correctamente (GET)
      await new Promise(r => setTimeout(r, 600));
      let getRes, getBody;
      try {
        getRes = await fetch(`${process.env.KEYSERVER_URL ?? 'https://h6rnyx-keyserver.vercel.app'}/api/announcement`);
        getBody = await getRes.json().catch(() => ({}));
      } catch (err) {
        await message.reactions.removeAll().catch(() => {});
        return message.reply(`⚠️ Anuncio enviado, pero no se pudo verificar: ${err.message}`);
      }

      await message.reactions.removeAll().catch(() => {});

      const guardado = getBody?.message?.trim();
      const enviado  = texto.trim();

      if (guardado === enviado) {
        await message.react('✅').catch(() => {});
        const ts = getBody.timestamp
          ? `<t:${Math.floor(getBody.timestamp)}:R>`
          : '';
        return message.reply(
          `✅ **Anuncio verificado y activo en el hub Roblox** ${ts}\n` +
          `> ${texto}\n` +
          `> Autor guardado: **${getBody.author ?? message.author.username}**`
        );
      } else {
        await message.react('⚠️').catch(() => {});
        return message.reply(
          `⚠️ El anuncio se envió pero el keyserver tiene un texto diferente.\n` +
          `**Enviado:** ${enviado}\n` +
          `**Guardado:** ${guardado ?? '(vacío)'}`
        );
      }
    },
  };
  