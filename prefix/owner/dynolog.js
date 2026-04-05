export default {
  nombre: 'dynolog',
  descripcion: 'Crea canales de log estilo Dyno visibles solo para staff.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;
    const everyoneRole = guild.roles.everyone;

    let categoria = guild.channels.cache.find(
      (c) => c.name === '・୨୧・dyno-logs﹒' && c.type === 4
    );

    if (!categoria) {
      categoria = await guild.channels.create({
        name: '・୨୧・dyno-logs﹒',
        type: 4,
        permissionOverwrites: [{ id: everyoneRole.id, deny: ['ViewChannel'] }],
      });
    }

    const canales = [
      '・୨୧・message-delete﹒', '・୨୧・message-edit﹒', '・୨୧・image-delete﹒',
      '・୨୧・bulk-message-delete﹒', '・୨୧・moderator-commands﹒',
      '・୨୧・member-role-add﹒', '・୨୧・member-role-remove﹒',
      '・୨୧・role-create﹒', '・୨୧・role-delete﹒', '・୨୧・role-update﹒',
      '・୨୧・channel-create﹒', '・୨୧・channel-update﹒', '・୨୧・channel-delete﹒',
      '・୨୧・emoji-create﹒', '・୨୧・emoji-delete﹒',
    ];

    for (const nombre of canales) {
      const existe = guild.channels.cache.find((c) => c.name === nombre && c.parentId === categoria.id);
      if (!existe) {
        await guild.channels.create({
          name: nombre,
          type: 0,
          parent: categoria.id,
          permissionOverwrites: [{ id: everyoneRole.id, deny: ['ViewChannel'] }],
        });
      }
    }

    message.reply('✅ Canales de log creados bajo `・୨୧・dyno-logs﹒`.');
  },
};
