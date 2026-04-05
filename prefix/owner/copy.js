import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  nombre: 'copy',
  descripcion: 'Copia la estructura del servidor (roles y canales) a backup.json.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;
    await message.reply(`⏳ Copiando estructura de **${guild.name}**...`);

    const roles = guild.roles.cache
      .filter((r) => r.id !== guild.id)
      .map((r) => ({
        name: r.name,
        color: r.color,
        hoist: r.hoist,
        permissions: r.permissions.bitfield.toString(),
        mentionable: r.mentionable,
        position: r.position,
      }));

    const channels = guild.channels.cache.map((c) => ({
      name: c.name,
      type: c.type,
      parent: c.parent ? c.parent.name : null,
      position: c.position,
      permissionOverwrites: c.permissionOverwrites.cache.map((po) => ({
        id: po.id,
        type: po.type,
        allow: po.allow.bitfield.toString(),
        deny: po.deny.bitfield.toString(),
      })),
    }));

    const data = { serverName: guild.name, roles, channels };
    const backupPath = join(__dirname, '../../backup.json');
    writeFileSync(backupPath, JSON.stringify(data, null, 2));

    message.reply('✅ Copia guardada en **backup.json**.');
  },
};
