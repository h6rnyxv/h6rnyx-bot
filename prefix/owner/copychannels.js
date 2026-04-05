import { ChannelType } from 'discord.js';

export default {
  nombre: 'copychannels',
  descripcion: 'Duplica todas las categorías y canales del servidor.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;

    try {
      await message.author.send('⚙️ Copiando canales y categorías...').catch(() => {});

      const categorias = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory);
      const nuevasCategorias = {};

      for (const [, cat] of categorias) {
        const nueva = await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory });
        nuevasCategorias[cat.id] = nueva;
      }

      const canales = guild.channels.cache.filter(
        (c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
      );

      for (const [, canal] of canales) {
        const parentId = canal.parentId && nuevasCategorias[canal.parentId]
          ? nuevasCategorias[canal.parentId].id
          : null;
        await guild.channels.create({ name: canal.name, type: canal.type, parent: parentId, position: canal.position });
      }

      await message.author.send('✅ Copia de canales completada.').catch(() => {});
      message.reply('✅ Canales duplicados correctamente.');
    } catch (err) {
      console.error(err);
      message.reply('❌ Ocurrió un error al copiar los canales.');
    }
  },
};
