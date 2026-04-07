import { EmbedBuilder } from 'discord.js';

  const COLOR  = 0x9b59b6;
  const FOOTER = 'h6rnyxv hub';

  const EMBEDS = {
    '1': {
      label: 'getkey',
      build: (img) => new EmbedBuilder()
        .setTitle('🔑 Get Your Key — h6rnyxv Hub')
        .setColor(COLOR)
        .setFooter({ text: FOOTER })
        .setTimestamp()
        .setDescription(
          '🇺🇸 **How to get your key:**\n' +
          '> 1. Click the link below and complete the steps.\n' +
          '> 2. Copy your key once generated.\n' +
          '> 3. Paste it into the script when prompted.\n\n' +
          '🔗 **Keyserver:** https://h6rnyx-keyserver.vercel.app/\n\n' +
          '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
          '🇪🇸 **Cómo obtener tu key:**\n' +
          '> 1. Haz clic en el enlace y completa los pasos.\n' +
          '> 2. Copia tu key una vez generada.\n' +
          '> 3. Pégala en el script cuando se te pida.\n\n' +
          '🔗 **Keyserver:** https://h6rnyx-keyserver.vercel.app/\n\n' +
          '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
          '📜 **Script:**\n' +
          '```\nloadstring(game:HttpGet("https://h6rnyx-keyserver.vercel.app/loader"))()\n```\n\n' +
          '-# If the script URL is wrong, contact staff to get the correct one.'
        )
        .setImage(img || null),
    },
    '2': {
      label: 'rules',
      build: (img) => new EmbedBuilder()
        .setTitle('📜 Server Rules — h6rnyxv Hub')
        .setColor(COLOR)
        .setFooter({ text: FOOTER })
        .setTimestamp()
        .setDescription(
          '-# By being in this server you automatically agree to all rules below.\n\n' +
          '🇺🇸 **English**\n```\n' +
          '1.  No scams or fraud\n2.  No malicious scripts\n3.  Respect all members\n' +
          '4.  No spam or flooding\n5.  No NSFW content\n6.  No advertising without permission\n' +
          '7.  No leaking paid scripts\n8.  No toxicity or hate speech\n9.  Follow Discord TOS\n' +
          '10. No impersonation\n11. Use the correct channels\n12. No fake giveaways\n' +
          '13. No harassment\n14. No selling without staff permission\n15. Staff decisions are final\n```\n\n' +
          '🇪🇸 **Español**\n```\n' +
          '1.  No estafas ni fraude\n2.  No scripts maliciosos\n3.  Respeta a todos los miembros\n' +
          '4.  No spam ni floods\n5.  No contenido NSFW\n6.  No publicidad sin permiso\n' +
          '7.  No filtrar scripts de pago\n8.  No toxicidad ni odio\n9.  Sigue las reglas de Discord\n' +
          '10. No suplantacion de identidad\n11. Usa los canales correctos\n12. No sorteos falsos\n' +
          '13. No acoso de ningun tipo\n14. No vender sin permiso del staff\n15. Decisiones del staff son finales\n```'
        )
        .setImage(img || null),
    },
    '3': {
      label: 'who-are-we',
      build: (img) => new EmbedBuilder()
        .setTitle('🌍 Who Are We? — ¿Quiénes Somos?')
        .setColor(COLOR)
        .setFooter({ text: FOOTER })
        .setTimestamp()
        .setDescription(
          '🇺🇸 **English**\n' +
          '> We are **h6rnyxv Hub** — a community built around the Roblox exploiting scene.\n' +
          '> We deliver scripts, tools, support and a space for players who want to push the limits.\n\n' +
          '**What we offer:**\n' +
          '> 🔑  Exclusive script keys\n> 🛠️  Active 24/7 support team\n' +
          '> 🧪  Script leaks & previews\n> 💬  Bilingual community EN/ES\n> 📢  Constant updates & news\n\n' +
          '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
          '🇪🇸 **Español**\n' +
          '> Somos **h6rnyxv Hub** — una comunidad alrededor del exploiting de Roblox.\n' +
          '> Ofrecemos scripts, soporte y un espacio para jugadores que quieren ir más allá.\n\n' +
          '**Lo que ofrecemos:**\n' +
          '> 🔑  Keys exclusivas de scripts\n> 🛠️  Soporte activo 24/7\n' +
          '> 🧪  Leaks y previews de scripts\n> 💬  Comunidad bilingüe EN/ES\n> 📢  Actualizaciones constantes'
        )
        .setImage(img || null),
    },
    '4': {
      label: 'hub-status',
      build: (img) => new EmbedBuilder()
        .setTitle('📊 Hub Status — h6rnyxv Hub')
        .setColor(COLOR)
        .setFooter({ text: FOOTER })
        .setTimestamp()
        .setDescription(
          '🇺🇸 **Script Status**\n' +
          '> 🟢  Script — **Online**\n' +
          '> 🟢  Keyserver — **Online**\n' +
          '> 🟢  Loader — **Online**\n\n' +
          '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
          '🇪🇸 **Estado del Script**\n' +
          '> 🟢  Script — **En línea**\n' +
          '> 🟢  Keyserver — **En línea**\n' +
          '> 🟢  Loader — **En línea**'
        )
        .setImage(img || null),
    },
  };

  const filter = m => m.author.id === null; // placeholder, overridden per use

  export default {
    nombre: 'enviarembeds',
    descripcion: 'Envía uno de los embeds del hub con imagen personalizada o sin imagen.',
    owner: true,

    async ejecutar({ message }) {
      const ch      = message.channel;
      const authorId = message.author.id;
      const colFilter = m => m.author.id === authorId && m.channel.id === ch.id;
      const opts     = { filter: colFilter, max: 1, time: 60_000 };

      // Step 1 — Pick embed
      const menu = new EmbedBuilder()
        .setTitle('📤 Enviar Embed')
        .setColor(0x9b59b6)
        .setDescription(
          'Elige qué embed quieres enviar:\n\n' +
          '**1** — 🔑 getkey\n' +
          '**2** — 📜 rules\n' +
          '**3** — 🌍 who-are-we\n' +
          '**4** — 📊 hub-status\n\n' +
          '-# Responde con el número o escribe `cancelar`.'
        );
      const m1 = await ch.send({ embeds: [menu] });
      const col1 = await ch.awaitMessages(opts).catch(() => null);
      const pick = col1?.first()?.content?.trim();
      await col1?.first()?.delete().catch(() => {});

      if (!pick || pick.toLowerCase() === 'cancelar' || !EMBEDS[pick]) {
        await m1.delete().catch(() => {});
        return ch.send({ embeds: [new EmbedBuilder().setColor(0xed4245).setDescription('❌ Cancelado o selección inválida.')] });
      }
      await m1.delete().catch(() => {});

      // Step 2 — Ask for image
      const m2 = await ch.send({ embeds: [
        new EmbedBuilder()
          .setColor(0x9b59b6)
          .setDescription(
            '🖼️ **¿Quieres agregar una imagen?**\n\n' +
            '• Pega una **URL de imagen** (https://...)\n' +
            '• O sube una **imagen adjunta** a este mensaje\n' +
            '• Escribe `no` para enviar **sin imagen**\n\n' +
            '-# Tienes 60 segundos.'
          )
      ] });

      const col2 = await ch.awaitMessages(opts).catch(() => null);
      const imgMsg = col2?.first();
      await m2.delete().catch(() => {});

      let imageUrl = null;

      if (imgMsg) {
        const txt = imgMsg.content?.trim().toLowerCase();
        await imgMsg.delete().catch(() => {});

        if (txt !== 'no' && txt !== 'cancelar') {
          // Check for attachment first
          const attachment = imgMsg.attachments.first();
          if (attachment) {
            imageUrl = attachment.url;
          } else if (imgMsg.content?.startsWith('http')) {
            imageUrl = imgMsg.content.trim();
          } else {
            return ch.send({ embeds: [new EmbedBuilder().setColor(0xed4245).setDescription('❌ URL inválida. Operación cancelada.')] });
          }
        }
      }

      // Step 3 — Ask for target channel
      const m3 = await ch.send({ embeds: [
        new EmbedBuilder()
          .setColor(0x9b59b6)
          .setDescription(
            '📢 **¿En qué canal lo envío?**\n\n' +
            '• Menciona el canal: `#canal`\n' +
            '• O escribe `aqui` para enviarlo en este canal\n\n' +
            '-# Tienes 60 segundos.'
          )
      ] });

      const col3 = await ch.awaitMessages(opts).catch(() => null);
      const chMsg = col3?.first();
      await m3.delete().catch(() => {});

      let targetChannel = ch;
      if (chMsg) {
        const txt = chMsg.content?.trim().toLowerCase();
        await chMsg.delete().catch(() => {});
        if (txt !== 'aqui') {
          const mentioned = chMsg.mentions?.channels?.first();
          if (mentioned) targetChannel = mentioned;
        }
      }

      // Send the embed
      const embed = EMBEDS[pick].build(imageUrl);
      await targetChannel.send({ embeds: [embed] });

      // Confirm
      const confirm = await ch.send({ embeds: [
        new EmbedBuilder()
          .setColor(0x57f287)
          .setDescription(`✅ Embed **${EMBEDS[pick].label}** enviado en ${targetChannel}${imageUrl ? ' con imagen' : ' sin imagen'}.`)
      ] });
      setTimeout(() => confirm.delete().catch(() => {}), 5000);
    },
  };
  