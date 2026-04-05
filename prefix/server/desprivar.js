import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'desprivar',
  descripcion: 'Quita la privacidad de uno o varios canales para un rol (por defecto @everyone).',
  owner: false,

  async ejecutar({ message }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const canales = message.mentions.channels;
    const rol = message.mentions.roles.first() || message.guild.roles.everyone;

    if (!canales.size) return message.reply('❌ Menciona al menos un canal. Ej: `!desprivar #canal [@rol]`');

    for (const [, canal] of canales) {
      await canal.permissionOverwrites.edit(rol, { ViewChannel: true, SendMessages: true }).catch(() => {});
    }

    message.reply(`🔓 Canales desprivatizados para **${rol.name}**.`);
  },
};
