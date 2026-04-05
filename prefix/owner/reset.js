export default {
  nombre: 'reset',
  descripcion: 'Borra todos los canales y roles del servidor y crea un #general. ¡IRREVERSIBLE!',
  owner: true,

  async ejecutar({ message }) {
    await message.author.send('⚠️ Reseteando servidor... esto puede tardar.').catch(() => {});

    for (const [, channel] of message.guild.channels.cache) {
      await channel.delete().catch(() => {});
    }

    for (const [, role] of message.guild.roles.cache) {
      if (role.name !== '@everyone' && !role.managed) {
        if (role.position < message.guild.members.me.roles.highest.position) {
          await role.delete().catch(() => {});
        }
      }
    }

    await message.guild.channels.create({ name: 'general', type: 0 }).catch(() => {});
    await message.author.send('✅ Servidor reseteado: queda @everyone y #general.').catch(() => {});
  },
};
