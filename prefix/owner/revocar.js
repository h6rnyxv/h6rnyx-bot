import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ruta = join(__dirname, '../../accesos.json');

export default {
  nombre: 'revocar',
  descripcion: 'Revoca el acceso de un usuario a un comando de owner.',
  owner: true,

  async ejecutar({ message, args }) {
    const user = message.mentions.users.first();
    const comando = args.find((a) => !a.startsWith('<@'));

    if (!user || !comando) return message.reply('❌ Uso: `!revocar @usuario comando`');

    const accesos = existsSync(ruta) ? JSON.parse(readFileSync(ruta)) : {};

    if (!accesos[comando] || !accesos[comando].includes(user.id)) {
      return message.reply(`ℹ️ **${user.tag}** no tenía acceso a \`${comando}\`.`);
    }

    accesos[comando] = accesos[comando].filter((id) => id !== user.id);
    writeFileSync(ruta, JSON.stringify(accesos, null, 2));
    message.reply(`✅ Acceso revocado a **${user.tag}** para \`${comando}\`.`);
  },
};
