import { ChannelType, PermissionsBitField, EmbedBuilder } from 'discord.js';

  const OLD_CAT_ID = '1378987497991831594';
  const COLOR      = 0x9b59b6;
  const FOOTER     = 'h6rnyxv hub';

  export default {
    nombre: 'setup',
    descripcion: 'Configura el servidor completo: archiva viejos, crea roles y estructura.',
    categoria: 'owner',

    async ejecutar({ client, message }) {
      const guild    = message.guild;
      const everyone = guild.roles.everyone;

      const log = [];
      const msg = await message.reply({ embeds: [prog('⏳ Iniciando setup...')] });

      // ── 1. Archivar categoría vieja ──────────────────────────────────────────
      await msg.edit({ embeds: [prog('📦 Archivando canales viejos...')] });
      let archiveCat = guild.channels.cache.find(c => c.name === '・୨୧・old﹒' && c.type === ChannelType.GuildCategory);
      if (!archiveCat) {
        archiveCat = await guild.channels.create({
          name: '・୨୧・old﹒', type: ChannelType.GuildCategory,
          permissionOverwrites: [{ id: everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }],
          position: 999,
        });
        log.push('✅ Categoría old creada');
      }
      const viejos = guild.channels.cache.filter(c => c.parentId === OLD_CAT_ID);
      for (const [, ch] of viejos) {
        await ch.setParent(archiveCat.id, { lockPermissions: false }).catch(() => {});
        await ch.permissionOverwrites.edit(everyone.id, { ViewChannel: false }).catch(() => {});
        log.push(`📦 Movido: ${ch.name}`);
      }
      const oldOriginal = guild.channels.cache.get(OLD_CAT_ID);
      if (oldOriginal) await oldOriginal.setName('・୨୧・old-archived﹒').catch(() => {});
      await archiveCat.setPosition(999).catch(() => {});

      // ── 2. Crear roles ───────────────────────────────────────────────────────
      await msg.edit({ embeds: [prog('🎭 Creando roles...')] });
      const rolesEst = [
        { name: '・୨୧・owner﹒👑',          color: 0xFFD700, hoist: true,  perms: PermissionsBitField.All },
        { name: '・୨୧・co-owner﹒💎',        color: 0xC084FC, hoist: true,  perms: PermissionsBitField.Flags.Administrator },
        { name: '・୨୧・admin﹒⚡',           color: 0x9B59B6, hoist: true,  perms: PermissionsBitField.Flags.Administrator },
        { name: '・୨୧・moderator﹒🛡️',       color: 0x3B82F6, hoist: true,  perms: 0n },
        { name: '・୨୧・staff﹒🔧',           color: 0x22C55E, hoist: true,  perms: 0n },
        { name: '・୨୧・developer﹒💻',       color: 0xEF4444, hoist: true,  perms: 0n },
        { name: '・୨୧・key-holder﹒🔑',      color: 0xF59E0B, hoist: true,  perms: 0n },
        { name: '・୨୧・vip﹒⭐',             color: 0xFBBF24, hoist: false, perms: 0n },
        { name: '・୨୧・early-supporter﹒🚀', color: 0x14B8A6, hoist: false, perms: 0n },
        { name: '・୨୧・booster﹒🎖️',         color: 0xF472B6, hoist: false, perms: 0n },
        { name: '・୨୧・verified﹒✅',         color: 0x6B7280, hoist: false, perms: 0n },
        { name: '・୨୧・member﹒👤',           color: 0x99AAB5, hoist: false, perms: 0n },
        { name: '・୨୧・bot﹒🤖',             color: 0x7289DA, hoist: false, perms: 0n },
        { name: '・୨୧・muted﹒🔇',            color: 0x374151, hoist: false, perms: 0n },
      ];
      for (const r of rolesEst) {
        if (guild.roles.cache.find(x => x.name === r.name)) { log.push(`⚠️ Rol existe: ${r.name}`); continue; }
        await guild.roles.create({ name: r.name, color: r.color, hoist: r.hoist, permissions: r.perms }).catch(() => {});
        log.push(`✅ Rol: ${r.name}`);
      }

      // ── 3. Crear canales ─────────────────────────────────────────────────────
      await msg.edit({ embeds: [prog('🏗️ Creando canales...')] });

      const ro = () => [
        { id: everyone.id, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.SendMessages] },
      ];
      const op = () => [
        { id: everyone.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
      ];
      const catPub = () => [{ id: everyone.id, allow: [PermissionsBitField.Flags.ViewChannel] }];

      const estructura = [
        { t:'cat',  name:'・୨୧・information﹒',        k:'cat_info',     ow: catPub() },
        { t:'text', name:'・୨୧・server-rules﹒📜',     k:'rules',        p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・who-are-we﹒🌍',       k:'whoarewe',     p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・announcements﹒📣',    k:'ann',          p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・small-announcements﹒📢', k:'small_ann', p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・faq﹒❓',              k:'faq',          p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・tickets﹒🎫',          k:'tickets',      p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・giveaways﹒🎁',        k:'giveaways',    p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・progress﹒📊',         k:'progress',     p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・updates﹒✅',           k:'updates',      p:'cat_info',    ow: ro() },
        { t:'text', name:'・୨୧・content﹒📸',          k:'content',      p:'cat_info',    ow: ro() },

        { t:'cat',  name:'・୨୧・shop﹒',               k:'cat_shop',     ow: catPub() },
        { t:'text', name:'・୨୧・vouches﹒✅',           k:'vouches',      p:'cat_shop',    ow: ro() },
        { t:'text', name:'・୨୧・proofs﹒📂',           k:'proofs',       p:'cat_shop',    ow: ro() },

        { t:'cat',  name:'・୨୧・members﹒',            k:'cat_members',  ow: op() },
        { t:'text', name:'・୨୧・media﹒📸',            k:'media',        p:'cat_members', ow: op() },
        { t:'text', name:'・୨୧・suggestions﹒💡',      k:'suggestions',  p:'cat_members', ow: op() },
        { t:'text', name:'・୨୧・commands﹒⚙️',         k:'commands',     p:'cat_members', ow: op() },
        { t:'text', name:'・୨୧・drawings﹒🎨',         k:'drawings',     p:'cat_members', ow: op() },
        { t:'text', name:'・୨୧・spanish-chat﹒🇪🇸',    k:'es_chat',      p:'cat_members', ow: op() },
        { t:'text', name:'・୨୧・english-chat﹒🇺🇸',    k:'en_chat',      p:'cat_members', ow: op() },

        { t:'cat',  name:'・୨୧・important﹒',          k:'cat_imp',      ow: catPub() },
        { t:'text', name:'・୨୧・global﹒🌍',           k:'imp_global',   p:'cat_imp',     ow: ro() },
        { t:'text', name:'・୨୧・games﹒🎮',            k:'games',        p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・support﹒🛠️',          k:'support',      p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・leaks﹒🧪',            k:'leaks',        p:'cat_imp',     ow: ro() },
        { t:'text', name:'・୨୧・bugs﹒🐞',             k:'bugs',         p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・feedback﹒📝',         k:'feedback',     p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・showcases﹒🎬',        k:'showcases',    p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・social﹒📱',           k:'social',       p:'cat_imp',     ow: op() },
        { t:'text', name:'・୨୧・videos﹒🎥',           k:'videos',       p:'cat_imp',     ow: op() },

        { t:'cat',  name:'・୨୧・h6rnyxv-hub﹒',       k:'cat_hub',      ow: catPub() },
        { t:'text', name:'・୨୧・rules﹒📜',            k:'hub_rules',    p:'cat_hub',     ow: ro() },
        { t:'text', name:'・୨୧・hub-status﹒📊',       k:'hub_status',   p:'cat_hub',     ow: ro() },
        { t:'text', name:'・୨୨・getkey﹒🔑',           k:'getkey',       p:'cat_hub',     ow: ro() },

        { t:'cat',  name:'・୨୧・ugphone﹒',            k:'cat_ug',       ow: catPub() },
        { t:'text', name:'・୨୨・ugphone﹒📱',          k:'ug_phone',     p:'cat_ug',      ow: op() },
        { t:'text', name:'・୨୨・files﹒📂',            k:'ug_files',     p:'cat_ug',      ow: ro() },

        { t:'cat',  name:'・୨୧・global﹒',             k:'cat_global',   ow: op() },
        { t:'text', name:'・୨୨・chat﹒🌎',             k:'global_chat',  p:'cat_global',  ow: op() },
      ];

      const C = {};
      for (const item of estructura) {
        if (item.t === 'cat') {
          let cat = guild.channels.cache.find(c => c.name === item.name && c.type === ChannelType.GuildCategory);
          if (!cat) {
            cat = await guild.channels.create({ name: item.name, type: ChannelType.GuildCategory, permissionOverwrites: item.ow }).catch(() => null);
            log.push(`✅ Categoría: ${item.name}`);
          } else { log.push(`⚠️ Existe: ${item.name}`); }
          if (cat) C[item.k] = cat;
        } else {
          const par = item.p ? C[item.p] : null;
          let ch = guild.channels.cache.find(c => c.name === item.name);
          if (!ch) {
            ch = await guild.channels.create({ name: item.name, type: ChannelType.GuildText, parent: par?.id, permissionOverwrites: item.ow }).catch(() => null);
            log.push(`✅ Canal: ${item.name}`);
          } else { log.push(`⚠️ Existe: ${item.name}`); }
          if (ch) C[item.k] = ch;
        }
      }

      // ── 4. Embeds ────────────────────────────────────────────────────────────
      await msg.edit({ embeds: [prog('📝 Enviando embeds...')] });

      if (C.rules) await C.rules.send({ embeds: [
        new EmbedBuilder().setTitle('📜 Server Rules — h6rnyxv Hub').setColor(COLOR).setFooter({ text: FOOTER }).setTimestamp()
          .setDescription(
            '> *By being here you agree to all rules below.*\n\n' +
            '🇺🇸 **English**\n```\n' +
            '1.  No scams or fraud\n2.  No malicious scripts\n3.  Respect all members\n' +
            '4.  No spam\n5.  No NSFW\n6.  No advertising without permission\n' +
            '7.  No leaking paid scripts\n8.  No toxicity\n9.  Follow Discord ToS\n' +
            '10. No impersonation\n11. Use correct channels\n12. No fake giveaways\n' +
            '13. No harassment\n14. No selling without permission\n15. Staff decisions are final\n```\n\n' +
            '🇪🇸 **Español**\n```\n' +
            '1.  No estafas\n2.  No scripts maliciosos\n3.  Respeta a todos\n' +
            '4.  No spam\n5.  No NSFW\n6.  No publicidad sin permiso\n' +
            '7.  No filtrar scripts de pago\n8.  No toxicidad\n9.  Sigue las reglas de Discord\n' +
            '10. No suplantacion\n11. Usa los canales correctos\n12. No sorteos falsos\n' +
            '13. No acoso\n14. No vender sin permiso\n15. Las decisiones del staff son finales\n```'
          )
      ] }).catch(() => {});

      if (C.whoarewe) await C.whoarewe.send({ embeds: [
        new EmbedBuilder().setTitle('🌍 Who Are We? — ¿Quiénes Somos?').setColor(COLOR).setFooter({ text: FOOTER }).setTimestamp()
          .setDescription(
            '🇺🇸 **English**\n' +
            '> We are **h6rnyxv Hub** — a community built around the Roblox exploiting scene.\n' +
            '> We provide scripts, tools, support, and a space for players who want to push limits.\n\n' +
            '• 🔑 Exclusive script keys\n• 🛠️ Active support team\n• 🧪 Script leaks & previews\n' +
            '• 💬 Bilingual community (EN/ES)\n• 📢 Constant updates\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '🇪🇸 **Español**\n' +
            '> Somos **h6rnyxv Hub** — una comunidad alrededor del exploiting de Roblox.\n' +
            '> Ofrecemos scripts, soporte y un espacio para jugadores que quieren ir más allá.\n\n' +
            '• 🔑 Keys exclusivas\n• 🛠️ Soporte activo\n• 🧪 Leaks y previews\n' +
            '• 💬 Comunidad bilingüe (EN/ES)\n• 📢 Actualizaciones constantes'
          )
      ] }).catch(() => {});

      if (C.hub_status) await C.hub_status.send({ embeds: [
        new EmbedBuilder().setTitle('📊 H6rnyxv Hub | Script Status').setColor(COLOR).setFooter({ text: FOOTER }).setTimestamp()
          .setDescription(
            '> *Updated manually by staff.*\n\n' +
            '🟢 Online  •  🟡 Not Updated  •  🔴 Down  •  ⚫ Discontinued\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '🟢 **Anchored Alpha** — Online'
          )
      ] }).catch(() => {});

      if (C.hub_rules) await C.hub_rules.send({ embeds: [
        new EmbedBuilder().setTitle('📜 Hub Rules').setColor(COLOR).setFooter({ text: FOOTER }).setTimestamp()
          .setDescription(
            '`1.` Do not share your key / No compartas tu key\n' +
            '`2.` Do not abuse the system / No abuses el sistema\n' +
            '`3.` Report bugs in `#bugs` / Reporta bugs en `#bugs`\n' +
            '`4.` Do not beg for keys / No pidas keys a otros\n' +
            '`5.` Staff decisions are final / Las decisiones del staff son finales'
          )
      ] }).catch(() => {});

      // ── 5. Resumen ───────────────────────────────────────────────────────────
      const nCreados = log.filter(l => l.startsWith('✅')).length;
      const nExisten = log.filter(l => l.startsWith('⚠️')).length;
      const nMovidos = log.filter(l => l.startsWith('📦')).length;

      await msg.edit({ embeds: [
        new EmbedBuilder()
          .setTitle('✅ Setup Completado — h6rnyxv Hub')
          .setColor(0x57f287)
          .setDescription('El servidor ha sido configurado correctamente.')
          .addFields(
            { name: '✅ Creados',       value: String(nCreados), inline: true },
            { name: '⚠️ Ya existían',  value: String(nExisten), inline: true },
            { name: '📦 Movidos',      value: String(nMovidos), inline: true },
          )
          .setFooter({ text: FOOTER })
          .setTimestamp()
      ] });
    },
  };

  function prog(desc) {
    return new EmbedBuilder().setDescription(desc).setColor(0x5865f2).setFooter({ text: 'h6rnyxv hub' });
  }
  