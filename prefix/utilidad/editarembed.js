import { EmbedBuilder, PermissionsBitField } from 'discord.js';

export default {
  nombre: 'editarembed',
  descripcion: 'Edita un embed existente. Uso: !editarembed <canalID> <mensajeID> [titulo=...] [descripcion=...] [color=...]',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ No tienes permiso para usar este comando.');

    if (args.length < 2) return message.reply('❌ Uso: `!editarembed <canalID> <mensajeID> [titulo=...] [descripcion=...] [color=...] [footer=...]`');

    const [canalID, mensajeID, ...opcArr] = args;
    const opc = opcArr.join(' ');

    const get = (k) => new RegExp(`${k}=("[^"]+"|[^\\s]+)`, 'i').exec(opc)?.[1]?.replace(/^"(.+)"$/, '$1');

    try {
      const canal = await message.guild.channels.fetch(canalID);
      if (!canal) return message.reply('❌ Canal no encontrado.');
      const msg = await canal.messages.fetch(mensajeID);
      if (!msg) return message.reply('❌ Mensaje no encontrado.');
      const ant = msg.embeds[0];
      if (!ant) return message.reply('❌ Ese mensaje no tiene un embed.');

      const embed = new EmbedBuilder()
        .setTitle(get('titulo') || ant.title || null)
        .setDescription(get('descripcion') || ant.description || null)
        .setColor(get('color') || ant.color || 'Random');
      const footer = get('footer') || ant.footer?.text;
      if (footer) embed.setFooter({ text: footer });

      await msg.edit({ embeds: [embed] });
      message.reply('✅ Embed editado correctamente.');
    } catch {
      message.reply('❌ No pude editar el embed. Verifica los IDs y mis permisos.');
    }
  },
};
