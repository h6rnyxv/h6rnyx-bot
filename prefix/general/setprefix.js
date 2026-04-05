import { PermissionsBitField } from 'discord.js';
import { setPrefix, getPrefix } from '../../utils/settings.js';

export default {
  nombre: 'setprefix',
  descripcion: 'Cambia el prefijo del bot en este servidor (se guarda al reiniciar). Requiere permisos de Administrador.',
  owner: false,

  async ejecutar({ client, message, args }) {
    const esOwner = message.author.id === client.ownerId;
    const esAdmin = message.member?.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!esOwner && !esAdmin)
      return message.reply('❌ Necesitas permisos de **Administrador** para cambiar el prefijo.');

    const nuevo = args[0];
    if (!nuevo)
      return message.reply(`❌ Indica el nuevo prefijo. Uso: \`!setprefix .\`\nPrefix actual: \`${getPrefix(message.guild.id)}\``);

    if (nuevo.length > 5)
      return message.reply('❌ El prefijo no puede tener más de 5 caracteres.');

    setPrefix(message.guild.id, nuevo);
    message.reply(`✅ Prefix cambiado a \`${nuevo}\` para este servidor. Ya puedes usar \`${nuevo}help\`.`);
  },
};
