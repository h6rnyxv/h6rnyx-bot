import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  nombre: 'paste',
  descripcion: 'Importa backup.json al servidor actual (crea roles y canales si no existen).',
  owner: true,

  async ejecutar({ message }) {
    const backupPath = join(__dirname, '../../backup.json');
    if (!existsSync(backupPath)) return message.reply('❌ No existe `backup.json`. Usa `!copy` primero.');

    const data = JSON.parse(readFileSync(backupPath, 'utf8'));
    const guild = message.guild;

    await message.reply(`⏳ Importando estructura de **${data.serverName}**...`);

    for (const role of data.roles) {
      if (role.name === '@everyone') continue;
      const existe = guild.roles.cache.find((r) => r.name === role.name);
      if (!existe) {
        await guild.roles.create({
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: BigInt(role.permissions),
          mentionable: role.mentionable,
        }).catch(() => {});
      }
    }

    const categorias = {};
    for (const ch of data.channels.filter((c) => c.type === 4)) {
      const existe = guild.channels.cache.find((c) => c.name === ch.name && c.type === 4);
      if (!existe) {
        const nueva = await guild.channels.create({ name: ch.name, type: 4 }).catch(() => null);
        if (nueva) categorias[ch.name] = nueva.id;
      } else {
        categorias[ch.name] = existe.id;
      }
    }

    for (const ch of data.channels.filter((c) => c.type !== 4)) {
      const existe = guild.channels.cache.find((c) => c.name === ch.name && c.type === ch.type);
      if (!existe) {
        await guild.channels.create({
          name: ch.name,
          type: ch.type,
          parent: ch.parent && categorias[ch.parent] ? categorias[ch.parent] : null,
        }).catch(() => {});
      }
    }

    message.reply(`✅ Importación completada en **${guild.name}**.`);
  },
};
