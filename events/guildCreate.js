import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'guildCreate',
  once: false,

  async execute(client, guild) {
    console.log(`[BOT] Entró al servidor: ${guild.name} (${guild.id})`);

    try {
      const rol = await guild.roles.create({
        name: client.user.username,
        color: 0x5865F2,
        permissions: [PermissionFlagsBits.Administrator],
        hoist: true,
        reason: 'Rol automático del bot al entrar al servidor.',
      });

      const botMember = await guild.members.fetchMe();
      await botMember.roles.add(rol);

      console.log(`[BOT] Rol '${rol.name}' creado y asignado en ${guild.name}`);
    } catch (err) {
      console.error(`[BOT] Error al crear rol en ${guild.name}:`, err.message);
    }
  },
};