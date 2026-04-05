export default {
  nombre: 'dlr',
  descripcion: 'Borra todos los roles posibles del servidor (excepto @everyone y los gestionados).',
  owner: true,

  async ejecutar({ message }) {
    await message.author.send('⚠️ Eliminando todos los roles posibles...').catch(() => {});

    let count = 0;
    for (const [, role] of message.guild.roles.cache) {
      if (role.name === '@everyone') continue;
      if (role.managed) continue;
      if (role.position >= message.guild.members.me.roles.highest.position) continue;

      await role.delete().catch(() => {});
      count++;
    }

    await message.author.send(`✅ Se eliminaron **${count}** roles.`).catch(() => {});
    message.reply(`✅ Se eliminaron **${count}** roles del servidor.`);
  },
};
