import { EmbedBuilder, PermissionsBitField } from 'discord.js';

export default {
  nombre: 'embedcustom',
  descripcion: 'Crea un embed personalizado. Uso: !embedcustom canal=<#id> titulo=<txt> descripcion=<txt> [color=#hex] [footer=<txt>] [imagen=<url>]',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const txt = args.join(' ');
    const canalId = txt.match(/canal=<#(\d+)>/)?.[1];
    const titulo = txt.match(/titulo=(.+?)(?=\s(?:descripcion=|color=|footer=|imagen=|$))/s)?.[1]?.trim();
    const descripcion = txt.match(/descripcion=(.+?)(?=\s(?:color=|footer=|imagen=|$))/s)?.[1]?.trim();
    const color = txt.match(/color=(#[0-9A-Fa-f]{6})/)?.[1] || '#2B2D31';
    const footer = txt.match(/footer=([^\n]+)/)?.[1]?.trim();
    const imagen = txt.match(/imagen=(https?:\/\/\S+)/)?.[1];

    if (!canalId || !titulo || !descripcion)
      return message.reply('❌ Debes incluir `canal=`, `titulo=` y `descripcion=`. Ejemplo:\n`!embedcustom canal=#general titulo=Hola descripcion=Mensaje`');

    const canal = message.guild.channels.cache.get(canalId);
    if (!canal) return message.reply('❌ Canal no encontrado.');

    const embed = new EmbedBuilder().setTitle(titulo).setDescription(descripcion).setColor(color);
    if (footer) embed.setFooter({ text: footer });
    if (imagen) embed.setImage(imagen);

    await canal.send({ embeds: [embed] });
    message.reply(`✅ Embed enviado en <#${canalId}>.`);
  },
};
