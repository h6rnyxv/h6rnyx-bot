export default {
  nombre: 'roles',
  descripcion: 'Crea roles organizados jerárquicamente para el servidor.',
  owner: true,

  async ejecutar({ message }) {
    const rolesACrear = [
      { name: '👑 Owner', permissions: ['Administrator'], hoist: true },
      { name: '🔧 Administrador', permissions: ['ManageGuild', 'BanMembers', 'KickMembers'], hoist: true },
      { name: '🛡️ Moderador', permissions: ['ManageMessages', 'ModerateMembers', 'KickMembers'], hoist: true },
      { name: '🔍 Helper', permissions: ['ManageMessages'], hoist: true },
      { name: '🌸 Flarecitos', permissions: [], hoist: true },
      { name: '🤝 Amigos', permissions: [], hoist: true },
      { name: '🌐 Alianzas', permissions: [], hoist: true },
      { name: '💫 Mimi', permissions: [], hoist: true },
      { name: '🔥 iFlare', permissions: [], hoist: true },
    ];

    const creados = [];
    for (const data of rolesACrear) {
      try {
        const nuevo = await message.guild.roles.create({
          name: data.name,
          permissions: data.permissions,
          hoist: data.hoist,
          color: 'Default',
          reason: 'Creación automática por Layout',
        });
        creados.push(nuevo);
      } catch (err) {
        console.error(`Error creando ${data.name}:`, err.message);
      }
    }

    message.reply(`✅ Se crearon **${creados.length}** roles correctamente.`);
  },
};
