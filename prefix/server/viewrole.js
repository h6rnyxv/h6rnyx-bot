import { PermissionsBitField, EmbedBuilder } from 'discord.js';

export default {
  nombre: 'viewrole',
  descripcion: 'Muestra qué canales puede ver un rol.',
  owner: false,

  async ejecutar({ message }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const rol = message.mentions.roles.first() || message.guild.roles.everyone;
    const visibles = [];
    const ocultos = [];

    message.guild.channels.cache.forEach((canal) => {
      if (canal.permissionsFor(rol)?.has(PermissionsBitField.Flags.ViewChannel)) {
        visibles.push(`<#${canal.id}>`);
      } else {
        ocultos.push(`<#${canal.id}>`);
      }
    });

    const embed = new EmbedBuilder()
      .setTitle(`🔍 Acceso de canales para @${rol.name}`)
      .setColor('Blue')
      .addFields(
        { name: '✅ Visibles', value: visibles.length ? visibles.join(', ') : 'Ninguno' },
        { name: '❌ Ocultos', value: ocultos.length ? ocultos.join(', ') : 'Ninguno' }
      );

    message.channel.send({ embeds: [embed] });
  },
};
