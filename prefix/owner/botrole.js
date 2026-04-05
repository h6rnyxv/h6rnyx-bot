import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'botrole',
  descripcion: 'Crea un rol para bots con permisos de admin y lo asigna a todos los bots del servidor.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;
    const botMember = guild.members.me;

    let botRole = guild.roles.cache.find((r) => r.name === '🤖・Bots');

    if (!botRole) {
      try {
        botRole = await guild.roles.create({
          name: '🤖・Bots',
          color: 'Blurple',
          hoist: true,
          permissions: [PermissionsBitField.Flags.Administrator],
          reason: 'Rol decorado para bots',
        });
      } catch {
        return message.author.send('❌ No pude crear el rol. Verifica mis permisos.').catch(() => {});
      }
    }

    try {
      const maxPos = botMember.roles.highest.position - 1;
      await botRole.setPosition(maxPos);
    } catch {}

    const asignados = [];
    const fallidos = [];
    const bots = guild.members.cache.filter(
      (m) => m.user.bot && m.id !== botMember.id && !m.roles.cache.has(botRole.id)
    );

    for (const bot of bots.values()) {
      try {
        if (bot.roles.highest.position < botMember.roles.highest.position) {
          await bot.roles.add(botRole);
          asignados.push(bot.user.tag);
        } else {
          fallidos.push(bot.user.tag);
        }
      } catch {
        fallidos.push(bot.user.tag);
      }
    }

    let resumen = `✅ Rol asignado a **${asignados.length}** bot(s).`;
    if (fallidos.length > 0) resumen += `\n⚠️ No se pudo asignar a:\n- ${fallidos.join('\n- ')}`;

    message.author.send(resumen).catch(() => message.reply(resumen));
  },
};
