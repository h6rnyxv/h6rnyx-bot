export default {
  nombre: 'slowmode',
  descripcion: 'Activa o desactiva el slowmode en el canal.',
  owner: false,

  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('❌ No tienes permiso para cambiar el slowmode.');

    const segundos = parseInt(args[0]);
    if (isNaN(segundos) || segundos < 0 || segundos > 21600)
      return message.reply('❌ Especifica los segundos (0–21600). Usa `0` para desactivarlo.');

    try {
      await message.channel.setRateLimitPerUser(segundos);
      if (segundos === 0) {
        message.channel.send('🔓 Slowmode desactivado.');
      } else {
        message.channel.send(`🐢 Slowmode activado: **${segundos}** segundo(s) entre mensajes.`);
      }
    } catch {
      message.reply('❌ No pude cambiar el slowmode.');
    }
  },
};
