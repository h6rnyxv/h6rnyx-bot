import { ChannelType, PermissionsBitField, EmbedBuilder } from 'discord.js';

  const OLD_CAT_ID = '1378987497991831594';
  const COLOR      = 0x9b59b6;
  const FOOTER     = 'h6rnyxv hub';

  // Banners por canal
  const IMG = {
    rules:    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&q=80',
    who:      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    status:   'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?w=1200&q=80',
    getkey:   'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
    tickets:  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
    hubrules: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
  };

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

      // server-rules
      if (C.rules) await C.rules.send({ embeds: [
        new EmbedBuilder()
          .setTitle('📜  Server Rules — h6rnyxv Hub')
          .setColor(COLOR)
          .setImage(IMG.rules)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '-# By being in this server you automatically agree to all rules below.\n\n' +
            '🇺🇸 **English**\n```\n' +
            '1.  No scams or fraud\n' +
            '2.  No malicious scripts\n' +
            '3.  Respect all members\n' +
            '4.  No spam or flooding\n' +
            '5.  No NSFW content\n' +
            '6.  No advertising without permission\n' +
            '7.  No leaking paid scripts\n' +
            '8.  No toxicity or hate speech\n' +
            '9.  Follow Discord Terms of Service\n' +
            '10. No impersonation\n' +
            '11. Use the correct channels\n' +
            '12. No fake giveaways\n' +
            '13. No harassment\n' +
            '14. No selling without staff permission\n' +
            '15. Staff decisions are final\n```\n\n' +
            '🇪🇸 **Español**\n```\n' +
            '1.  No estafas ni fraude\n' +
            '2.  No scripts maliciosos\n' +
            '3.  Respeta a todos los miembros\n' +
            '4.  No spam ni floods\n' +
            '5.  No contenido NSFW\n' +
            '6.  No publicidad sin permiso\n' +
            '7.  No filtrar scripts de pago\n' +
            '8.  No toxicidad ni odio\n' +
            '9.  Sigue las reglas de Discord\n' +
            '10. No suplantacion de identidad\n' +
            '11. Usa los canales correctos\n' +
            '12. No sorteos falsos\n' +
            '13. No acoso de ningun tipo\n' +
            '14. No vender sin permiso del staff\n' +
            '15. Las decisiones del staff son finales\n```'
          )
      ] }).catch(() => {});

      // who-are-we
      if (C.whoarewe) await C.whoarewe.send({ embeds: [
        new EmbedBuilder()
          .setTitle('🌍  Who Are We? — ¿Quiénes Somos?')
          .setColor(COLOR)
          .setImage(IMG.who)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '🇺🇸 **English**\n' +
            '> We are **h6rnyxv Hub** — a community built around the Roblox exploiting scene.\n' +
            '> We deliver scripts, tools, support and a space for players who want to push the limits.\n\n' +
            '**What we offer:**\n' +
            '> 🔑  Exclusive script keys\n' +
            '> 🛠️  Active 24/7 support team\n' +
            '> 🧪  Script leaks & previews\n' +
            '> 💬  Bilingual community EN/ES\n' +
            '> 📢  Constant updates & news\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '🇪🇸 **Español**\n' +
            '> Somos **h6rnyxv Hub** — una comunidad alrededor del exploiting de Roblox.\n' +
            '> Ofrecemos scripts, soporte y un espacio para jugadores que quieren ir más allá.\n\n' +
            '**Lo que ofrecemos:**\n' +
            '> 🔑  Keys exclusivas de scripts\n' +
            '> 🛠️  Soporte activo 24/7\n' +
            '> 🧪  Leaks y previews de scripts\n' +
            '> 💬  Comunidad bilingüe EN/ES\n' +
            '> 📢  Actualizaciones constantes'
          )
      ] }).catch(() => {});

      // hub-status
      if (C.hub_status) await C.hub_status.send({ embeds: [
        new EmbedBuilder()
          .setTitle('📊  H6rnyxv Hub | Script Status')
          .setColor(COLOR)
          .setImage(IMG.status)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '-# Status is updated manually by staff.\n\n' +
            '**Legend:**\n' +
            '🟢 Online  •  🟡 Not Updated  •  🔴 Down  •  ⚫ Discontinued\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '**Scripts:**\n' +
            '🟢  **Anchored Alpha** — Online'
          )
      ] }).catch(() => {});

      // hub-rules
      if (C.hub_rules) await C.hub_rules.send({ embeds: [
        new EmbedBuilder()
          .setTitle('📜  Hub Rules — h6rnyxv Hub')
          .setColor(COLOR)
          .setImage(IMG.hubrules)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '-# Rules specific to the h6rnyxv Hub section.\n\n' +
            '`1.`  Do not share your key  •  No compartas tu key\n' +
            '`2.`  Do not abuse the system  •  No abuses el sistema\n' +
            '`3.`  Report bugs in `#bugs`  •  Reporta bugs en `#bugs`\n' +
            '`4.`  Do not beg for keys  •  No pidas keys a otros\n' +
            '`5.`  Staff decisions are final  •  Las decisiones del staff son finales'
          )
      ] }).catch(() => {});

      // tickets info
      if (C.tickets) await C.tickets.send({ embeds: [
        new EmbedBuilder()
          .setTitle('🎫  Support Tickets — h6rnyxv Hub')
          .setColor(COLOR)
          .setImage(IMG.tickets)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '🇺🇸 **Need help?**\n' +
            '> Open a private ticket and a staff member will assist you shortly.\n\n' +
            '**You can open a ticket for:**\n' +
            '> 🔑  Issues with your key\n' +
            '> 🐞  Bug reports\n' +
            '> 🛠️  General support\n' +
            '> 📝  Other requests\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '🇪🇸 **¿Necesitas ayuda?**\n' +
            '> Abre un ticket privado y un miembro del staff te atenderá pronto.\n\n' +
            '**Puedes abrir un ticket para:**\n' +
            '> 🔑  Problemas con tu key\n' +
            '> 🐞  Reportar bugs\n' +
            '> 🛠️  Soporte general\n' +
            '> 📝  Otras solicitudes\n\n' +
            '-# Use the `/ticket` command to open the ticket panel.'
          )
      ] }).catch(() => {});

      // getkey — enlace + script
      if (C.getkey) await C.getkey.send({ embeds: [
        new EmbedBuilder()
          .setTitle('🔑  Get Your Key — h6rnyxv Hub')
          .setColor(COLOR)
          .setImage(IMG.getkey)
          .setFooter({ text: FOOTER })
          .setTimestamp()
          .setDescription(
            '🇺🇸 **How to get your key:**\n' +
            '> **1.** Click the link below and complete the steps.\n' +
            '> **2.** Copy your key once generated.\n' +
            '> **3.** Paste it into the script when prompted.\n\n' +
            '🔗 **Keyserver:** https://h6rnyx-keyserver.vercel.app\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '🇪🇸 **Cómo obtener tu key:**\n' +
            '> **1.** Haz clic en el enlace y completa los pasos.\n' +
            '> **2.** Copia tu key una vez generada.\n' +
            '> **3.** Pégala en el script cuando se te pida.\n\n' +
            '🔗 **Keyserver:** https://h6rnyx-keyserver.vercel.app\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '📜 **Script:**\n' +
            '```lua\n' +
            'loadstring(game:HttpGet("https://h6rnyx-keyserver.vercel.app/loader"))()\n' +
            '```\n' +
            '-# If the script URL is wrong, contact staff to get the correct one.'
          )
      ] }).catch(() => {});

      // ── 5. Resumen ───────────────────────────────────────────────────────────
      const nCreados = log.filter(l => l.startsWith('✅')).length;
      const nExisten = log.filter(l => l.startsWith('⚠️')).length;
      const nMovidos = log.filter(l => l.startsWith('📦')).length;

      await msg.edit({ embeds: [
        new EmbedBuilder()
          .setTitle('✅  Setup Completado — h6rnyxv Hub')
          .setColor(0x57f287)
          .setDescription('El servidor ha sido configurado correctamente.')
          .addFields(
            { name: '✅ Creados',      value: String(nCreados), inline: true },
            { name: '⚠️ Ya existían', value: String(nExisten), inline: true },
            { name: '📦 Movidos',     value: String(nMovidos), inline: true },
          )
          .setFooter({ text: FOOTER })
          .setTimestamp()
      ] });
    },
  };

  function prog(desc) {
    return new EmbedBuilder().setDescription(desc).setColor(0x5865f2).setFooter({ text: 'h6rnyxv hub' });
  }
  