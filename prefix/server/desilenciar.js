import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'desilenciar',
  descripcion: 'Permite a un rol volver a enviar mensajes en los canales mencionados.',
  owner: false,

  async ejecutar({ message }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const canales = message.mentions.channels;
    const rol = message.mentions.roles.first() || message.guild.roles.everyone;

    if (!canales.size) return message.reply('❌ Menciona al menos un canal. Ej: `!desilenciar #canal [@rol]`');

    for (const [, canal] of canales) {
      await canal.permissionOverwrites.edit(rol, { SendMessages: true }).catch(() => {});
    }

    message.reply(`🔈 Canales des-silenciados para **${rol.name}**.`);
  },
};
