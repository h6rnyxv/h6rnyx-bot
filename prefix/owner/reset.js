export default {
  nombre: 'reset',
  descripcion: 'Borra todos los canales y roles del servidor y crea un #general y voz. ¡IRREVERSIBLE!',
  owner: true,

  async ejecutar({ message }) {
    await message.author.send('⚠️ Reseteando servidor... esto puede tardar.').catch(() => {});

    const channels = await message.guild.channels.fetch().catch(() => null);
    if (channels) {
      for (const [, channel] of channels) {
        if (channel) await channel.delete().catch(() => {});
      }
    }

    const roles = await message.guild.roles.fetch().catch(() => null);
    const me = await message.guild.members.fetchMe().catch(() => null);
    const myHighestPosition = me?.roles?.highest?.position ?? 0;

    if (roles) {
      for (const [, role] of roles) {
        if (!role || role.name === '@everyone' || role.managed) continue;
        if (role.position < myHighestPosition) {
          await role.delete().catch(() => {});
        }
      }
    }

    await message.guild.channels.create({ name: 'general', type: 0 }).catch(() => {});
    await message.guild.channels.create({ name: 'General', type: 2 }).catch(() => {});
    await message.author.send('✅ Servidor reseteado: queda @everyone, #general y el canal de voz General.').catch(() => {});
  },
};