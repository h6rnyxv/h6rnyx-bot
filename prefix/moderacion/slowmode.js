export default {
  nombre: 'slowmode',
  async ejecutar({ message, args }) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('❌ No tienes permiso para cambiar el slowmode.');
    const segundos = parseInt(args[0]);
    if (isNaN(segundos) || segundos < 0 || segundos > 21600)
      return message.reply('❌ Especifica los segundos (0–21600). Usa `0` para desactivarlo.');
    try {
      await message.channel.setRateLimitPerUser(segundos);
      message.channel.send(segundos === 0 ? '🔓 Slowmode desactivado.' : `🐢 Slowmode: **${segundos}** segundo(s).`);
    } catch {
      message.reply('❌ No pude cambiar el slowmode.');
    }
  },
};
