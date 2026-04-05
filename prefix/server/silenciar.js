import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'silenciar',
  descripcion: 'Bloquea el envío de mensajes de un rol en canales mencionados.',
  owner: false,

  async ejecutar({ message }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const canales = message.mentions.channels;
    const rol = message.mentions.roles.first() || message.guild.roles.everyone;

    if (!canales.size) return message.reply('❌ Menciona al menos un canal. Ej: `!silenciar #canal [@rol]`');

    for (const [, canal] of canales) {
      await canal.permissionOverwrites.edit(rol, { SendMessages: false }).catch(() => {});
    }

    message.reply(`🔇 Canales silenciados para **${rol.name}**.`);
  },
};
