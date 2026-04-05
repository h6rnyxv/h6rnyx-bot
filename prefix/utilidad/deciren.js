import { PermissionsBitField } from 'discord.js';

export default {
  nombre: 'deciren',
  descripcion: 'Envía un mensaje en otro canal.',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const canal = message.mentions.channels.first();
    const texto = args.filter((a) => !a.match(/^<#\d+>$/)).join(' ');

    if (!canal || !texto) return message.reply('❌ Uso: `!deciren #canal tu mensaje aquí`');

    await canal.send(texto);
    message.reply('✅ Mensaje enviado.');
  },
};
