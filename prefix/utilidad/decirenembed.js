import { EmbedBuilder, PermissionsBitField } from 'discord.js';

export default {
  nombre: 'decirenembed',
  descripcion: 'Envía un embed a otro canal. Uso: !decirenembed #canal [everyone/here/@rol] <texto> [#color]',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply('❌ No tienes permiso para usar este comando.');

    const canal = message.mentions.channels.first();
    if (!canal) return message.reply('❌ Debes mencionar un canal.');

    const resto = args.filter((a) => !a.match(/^<#\d+>$/));

    let mention = null;
    if (resto[0] === 'everyone') { mention = '@everyone'; resto.shift(); }
    else if (resto[0] === 'here') { mention = '@here'; resto.shift(); }
    else if (message.mentions.roles.first()) {
      mention = `<@&${message.mentions.roles.first().id}>`;
      resto.shift();
    }

    let color = 'Random';
    const colorRegex = /^#?[0-9A-Fa-f]{6}$/;
    if (resto.length > 0 && colorRegex.test(resto[resto.length - 1])) {
      color = resto.pop();
      if (!color.startsWith('#')) color = `#${color}`;
    }

    const texto = resto.join(' ');
    if (!texto) return message.reply('❌ Debes escribir un mensaje.');

    const embed = new EmbedBuilder()
      .setDescription(texto)
      .setColor(color)
      .setFooter({ text: `Enviado por ${message.member.displayName}` });

    await canal.send({ content: mention ?? null, embeds: [embed] });
    message.reply('✅ Embed enviado.');
  },
};
