export default {
  nombre: 'chlog',
  descripcion: 'Crea canales de registro de moderación visibles solo para administradores.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;

    let categoria = guild.channels.cache.find(
      (c) => c.name === '・୨୧・staff﹒📑' && c.type === 4
    );

    if (!categoria) {
      categoria = await guild.channels.create({
        name: '・୨୧・staff﹒📑',
        type: 4,
        permissionOverwrites: [{ id: guild.roles.everyone, deny: ['ViewChannel'] }],
      });
    }

    const canales = [
      '・୨୧・miembro-baneado﹒🔨',
      '・୨୧・miembro-desbaneado﹒🕊️',
      '・୨୧・miembro-expulsado﹒🚪',
      '・୨୧・miembro-silenciado﹒🔇',
      '・୨୧・miembro-desilenciado﹒🔈',
      '・୨୧・miembro-advertido﹒⚠️',
      '・୨୧・miembro-desadvertido﹒✅',
      '・୨୧・caso-actualizado﹒📂',
    ];

    for (const nombre of canales) {
      const existe = guild.channels.cache.find((c) => c.name === nombre);
      if (!existe) {
        await guild.channels.create({
          name: nombre,
          type: 0,
          parent: categoria.id,
          permissionOverwrites: [
            { id: guild.roles.everyone, deny: ['ViewChannel'] },
            ...guild.roles.cache
              .filter((r) => r.permissions.has('Administrator'))
              .map((r) => ({ id: r.id, allow: ['ViewChannel'] })),
          ],
        });
      }
    }

    message.reply('✨ Canales de registros creados bajo `・୨୧・staff﹒📑`.');
  },
};
