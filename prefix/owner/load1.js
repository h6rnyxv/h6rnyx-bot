import { ChannelType } from 'discord.js';

export default {
  nombre: 'load1',
  descripcion: 'Recrea una estructura completa de servidor decorada (borra canales actuales).',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;
    const everyoneRole = guild.roles.everyone;
    const categorias = new Map();

    const estructura = [
      { type: 'category', name: '・୨୧・info﹒' },
      { type: 'text', name: '・୨୧・rules﹒📜', parent: '・୨୧・info﹒' },
      { type: 'text', name: '・୨୧・welcome﹒🖤', parent: '・୨୧・info﹒' },
      { type: 'text', name: '・୨୧・help﹒🛠️', parent: '・୨୧・info﹒' },
      { type: 'text', name: '・୨୧・announcements﹒📣', parent: '・୨୧・info﹒' },
      { type: 'text', name: '・୨୧・verify﹒🟣', parent: '・୨୧・info﹒', publica: true },

      { type: 'category', name: '・୨୧・roles﹒' },
      { type: 'text', name: '・୨୧・you﹒📰', parent: '・୨୧・roles﹒' },
      { type: 'text', name: '・୨୧・colors﹒🎨', parent: '・୨୧・roles﹒' },
      { type: 'text', name: '・୨୧・pings﹒📡', parent: '・୨୧・roles﹒' },

      { type: 'category', name: '・୨୧・chat﹒' },
      { type: 'text', name: '・୨୧・main﹒💬', parent: '・୨୧・chat﹒', publica: true },
      { type: 'text', name: '・୨୧・bots﹒🔍', parent: '・୨୧・chat﹒', publica: true },
      { type: 'text', name: '・୨୧・intros﹒🎤', parent: '・୨୧・chat﹒', publica: true },
      { type: 'text', name: '・୨୧・vent﹒🚩', parent: '・୨୧・chat﹒', publica: true },

      { type: 'category', name: '・୨୧・media﹒' },
      { type: 'text', name: '・୨୧・memes﹒🎭', parent: '・୨୧・media﹒', publica: true },
      { type: 'text', name: '・୨୧・selfies﹒📸', parent: '・୨୧・media﹒', publica: true },
      { type: 'text', name: '・୨୧・videos﹒🎬', parent: '・୨୧・media﹒', publica: true },

      { type: 'category', name: '・୨୧・voice﹒' },
      { type: 'voice', name: '・୨୧・talk﹒', parent: '・୨୧・voice﹒' },
      { type: 'voice', name: '・୨୧・talk 2﹒', parent: '・୨୧・voice﹒' },
      { type: 'voice', name: '・୨୧・music﹒🎵', parent: '・୨୧・voice﹒' },
      { type: 'voice', name: '・୨୧・afk﹒😴', parent: '・୨୧・voice﹒' },
      { type: 'voice', name: '・୨୧・stream﹒📺', parent: '・୨୧・voice﹒' },

      { type: 'category', name: '・୨୧・staff﹒📑', privada: true },
      { type: 'text', name: '・୨୧・staff-chat﹒', parent: '・୨୧・staff﹒📑' },
      { type: 'text', name: '・୨୧・logs﹒🔗', parent: '・୨୧・staff﹒📑' },
    ];

    for (const canal of guild.channels.cache.values()) {
      await canal.delete().catch(() => {});
    }

    await message.author.send('✅ Canales eliminados. Creando nueva estructura...').catch(() => {});

    for (const item of estructura) {
      if (item.type === 'category') {
        const overwrites = item.privada
          ? [{ id: everyoneRole.id, deny: ['ViewChannel'] }]
          : [{ id: everyoneRole.id, allow: item.publica ? ['ViewChannel'] : ['ViewChannel'] }];

        const cat = await guild.channels.create({
          name: item.name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites,
        });
        categorias.set(item.name, cat);
      } else {
        const parent = item.parent ? categorias.get(item.parent) : null;
        const tipo = item.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
        await guild.channels.create({ name: item.name, type: tipo, parent: parent?.id });
      }
    }

    await message.author.send('✅ Estructura del servidor creada correctamente.').catch(() => {});
  },
};
